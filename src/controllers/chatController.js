import { OpenRouter } from "@openrouter/sdk";

export const streamChat = async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ success: false, message: "Messages are required and must be an array." });
    }

    const openrouter = new OpenRouter({
        apiKey: process.env.OPENROUTER_API_KEY
    });

    try {
        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await openrouter.chat.send({
            model: "tngtech/deepseek-r1t2-chimera:free",
            messages: messages,
            stream: true
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error("OpenRouter Error:", error);
        res.write(`data: ${JSON.stringify({ error: "Failed to fetch response from AI." })}\n\n`);
        res.end();
    }
};
