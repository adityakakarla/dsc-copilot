# DSC Copilot

DSC Copilot is my attempt to build [v0.dev](http://v0.dev) for UCSD students.

# The Problem

UCSD data science courses often require niche requirements. For instance, DSC 10 uses babypandas (an easier version of pandas) and DSC 20/30 have a heavy emphasis on style.

Normal chatbots can be prompt engineered to capture this, but it can be an annoying process. In some cases (ex: when using Claude), messing around with prompts to get the right answer can make you hit rate limits.

# The Solution

A chatbot where prompts are auto-assigned based on the requested course. Yes, this is "just a GPT wrapper." Still cool nonetheless.

# Tech Stuff

Learned a ton about managing test vs prod environments for Stripe and Supabase. Also hit some weird SvelteKit bugs that took quite a few 2:00 AM commits to fix.
