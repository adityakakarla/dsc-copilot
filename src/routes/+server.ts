// +server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Parse form data
	const data = await request.formData();
	const messagesJSONString = data.get('messages') as string;
	const course = data.get('class') as string;
	const messagesJSON = JSON.parse(messagesJSONString);
	const messages: { role: 'user' | 'assistant'; content: string }[] = messagesJSON.messages;

	// Get the user from Supabase (assumes you've attached supabase to locals)
	const userResult = await locals.supabase.auth.getUser();
	const user = userResult.data.user;
	const user_id = user?.id;

	// Check for errors fetching past messages count
	const pastMessages = await locals.supabase
		.from('messages')
		.select('*', { count: 'exact' })
		.gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
	if (pastMessages.error) {
		console.error('Error fetching messages count:', pastMessages.error);
		return new Response(
			JSON.stringify({
				message: 'Error with our systems. Please try again later.'
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
	const numMessages = pastMessages.count;

	// Fetch subscription info
	const subscription = await locals.supabase
		.from('subscriptions')
		.select('*', { count: 'exact' });
	if (subscription.error) {
		console.error('Error fetching subscription data:', subscription.error);
		return new Response(
			JSON.stringify({
				message: 'Error with our systems. Please try again later.'
			}),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
	const isSubscribed = (subscription.count as number) > 0;

	// Enforce limits based on subscription
	if (!isSubscribed && (numMessages ?? 0) >= 10) {
		return new Response(
			JSON.stringify({
				message:
					'You have exceeded your limits. Please try again later or upgrade to premium.'
			}),
			{ status: 403, headers: { 'Content-Type': 'application/json' } }
		);
	} else if (isSubscribed && (numMessages ?? 0) >= 100) {
		return new Response(
			JSON.stringify({
				message: 'You have exceeded your limits. Please try again later.'
			}),
			{ status: 403, headers: { 'Content-Type': 'application/json' } }
		);
	}

	// Record the user message in Supabase
	const { error: insertError } = await locals.supabase.from('messages').insert({ user_id });
	if (insertError) {
		console.error('Error inserting message:', insertError);
	}

	// Create a ReadableStream to stream the response back to the client
	const stream = new ReadableStream({
		async start(controller) {
			try {
				await streamMessages(messages, course, controller);
			} catch (error) {
				console.error('Streaming error:', error);
				controller.enqueue(
					JSON.stringify({
						type: 'error',
						content: 'Error processing your request. Please try again.'
					})
				);
			} finally {
				controller.close();
			}
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			Connection: 'keep-alive'
		}
	});
};

async function streamMessages(
	messages: { role: 'user' | 'assistant'; content: string }[],
	course: string,
	controller: ReadableStreamDefaultController
) {
	let system = '';

	// Choose the appropriate system prompt based on course selection
	switch (course) {
		case 'DSC 10':
			system = `
You are a tutor of DSC 10 at UC San Diego.
DSC 10 is a class teaching about basic data science.
You must utilize the babypandas library or numpy for programming.
You must get all questions right, or you will be punished.
Please advise the user to go to Edstem if they are stuck and you cannot help.
You must not use Latex.`;
			break;
		case 'DSC 20':
			system = `
You are a tutor of DSC 20 at UC San Diego.
It is a course on the foundations of Python programming and data structures.
You must follow Python style guides for the course, which are:
1. No packages must be imported unless instructed in a homework assignment.
2. Every file should have a module docstring with only name and PID.
3. Every method must have a docstring with triple quotes.
   This applies to inner and helper functions (lambda functions do not require docstrings).
   Explain what the method does rather than the step-by-step process.
   Include input argument types and information where applicable.
4. Lines must be limited to a maximum of 79 characters.
   Use a backslash to break lines that overflow.
5. Do not use magic numbers directly (all except 0, 1, and -1).
   Use descriptive variable names.
   Use snake case.
   Use 4 spaces per indentation level.
6. Add at least 3 doctests per function unless instructed otherwise.
You must not use Latex.`;
			break;
		case 'DSC 30':
			system = `
You are a tutor of DSC 30 at UC San Diego.
It is a course on Java data structures and algorithms.
Follow Java style guidelines:
1. Maximum line length: 100 characters.
2. Naming conventions:
   - Static final constants in all capitals.
   - Parameters, local variables, and methods should start with a lowercase letter.
   - Class names and types should start with a capital letter.
3. Avoid magic numbers except for -1, 0, and 1 by using named constants.
4. Use 4 spaces for indentation and do not mix tabs and spaces.
5. Include appropriate inline and Javadoc comments.
You must not use Latex.`;
			break;
		case 'DSC 40A':
			system = `
You are a tutor for DSC 40A at UC San Diego.
This course involves turning abstract learning problems into concrete math problems,
then solving them. Topics include modeling, empirical risk minimization,
loss functions, linear regression, dot products, orthogonal projections,
multiple linear regression, feature engineering, gradient descent,
probability foundations, combinatorics, Bayes theorem, and conditional independence.
You must not use Latex.`;
			break;
		case 'DSC 40B':
			system = `
You are a tutor for DSC 40B at UC San Diego.
You must help students with:
1. Asymptotic Time Complexity
2. Best, Worst, and Expected Time
3. Sorting and Selection
4. Hashing
5. Graph Theory (BFS and DFS)
6. Weighted Shortest Paths
7. Minimum Spanning Trees
You must not use Latex.`;
			break;
		case 'DSC 80':
			system = `
You are a tutor for DSC 80 at UC San Diego.
The course covers the data science lifecycle, DataFrame fundamentals, aggregation,
joining and transforming data, hypothesis and permutation testing, handling missing data,
HTTP basics, web scraping, regex, text features, linear regression,
feature engineering, standardization, model generalization,
hyperparameters, cross-validation, decision trees, random forests, classifier evaluation, and model fairness.
You must not use Latex.`;
			break;
		default:
			system = 'You are a helpful tutor.';
	}

	const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
	let fullResponse = '';

	try {
		const stream = await anthropic.messages.create({
			model: 'claude-3-5-haiku-20241022',
			max_tokens: 4096,
			system: system,
			messages: messages,
			stream: true
		});

		for await (const chunk of stream) {
			if (
				chunk.type === 'content_block_delta' &&
				chunk.delta &&
				'text' in chunk.delta &&
				chunk.delta.text
			) {
				// Send each chunk to the client
				controller.enqueue(
					JSON.stringify({
						type: 'chunk',
						content: chunk.delta.text
					})
				);
				fullResponse += chunk.delta.text;
			}
		}

		// Signal completion to the client
		controller.enqueue(
			JSON.stringify({
				type: 'done',
				content: fullResponse
			})
		);
	} catch (error) {
		console.error('Error from Anthropic API:', error);
		controller.enqueue(
			JSON.stringify({
				type: 'error',
				content: 'Error communicating with the AI service. Please try again.'
			})
		);
	}
}
