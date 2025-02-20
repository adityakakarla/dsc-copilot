import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }: any) => {
    const { data, error } = await supabase
        .from('messages')
        .select();

    const groupedAndSorted = groupMessagesByConversation(data);
    if (error) {
        console.error('Error fetching messages:', error.message);
    }

    //@ts-expect-error
    return { history: mapToArray(mapToArray(groupedAndSorted)) };
};

function groupMessagesByConversation(messages: any[]) {
    const tempGroups: Record<string, string[]> = {};

    for (const message of messages) {
        const id = message.conversation_id;
        if (!tempGroups[id]) {
            tempGroups[id] = [];
        }
        tempGroups[id].push(message.message);
    }

    const sortedIds = Object.keys(tempGroups)
        .map(Number)
        .sort((a, b) => b - a);

    const result = new Map<number, string[]>();

    for (const id of sortedIds) {
        result.set(id, tempGroups[id]);
    }

    return result;
}

function mapToArray(map: Map<number, string[]>) {
    return [...map.values()]
}