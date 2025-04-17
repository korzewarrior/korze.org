// blog_api.js - JavaScript fallback for environments without PHP

// List of posts (hardcoded since we can't dynamically read directories with client-side JS)
// You'll need to update this array manually when adding new posts
const POST_FILES = [
    'posts/dothvdothpp.md',
    'posts/deletevdelete.md'
];

// Helper function to extract title from markdown content
function extractTitle(content) {
    // Look for markdown heading at the start (## Title or ### Title)
    const titleMatch = content.match(/^#+\s*(.+)$/m);
    if (titleMatch) {
        return titleMatch[1].trim();
    }
    // Fallback: If no heading found, use first line or a default
    const firstLine = content.split('\n')[0];
    return firstLine.trim() || 'Untitled Post';
}

// Simulate the PHP API response
async function getBlogPosts() {
    try {
        const posts = [];
        
        // Fetch each post file
        for (const file of POST_FILES) {
            try {
                const response = await fetch(file);
                if (!response.ok) {
                    console.error(`Failed to fetch ${file}: ${response.status}`);
                    continue;
                }
                
                const content = await response.text();
                const filename = file.split('/').pop();
                
                posts.push({
                    filename,
                    title: extractTitle(content),
                    content,
                    date: Date.now() // We don't have file dates, so use current time
                });
            } catch (err) {
                console.error(`Error processing ${file}:`, err);
            }
        }
        
        // Sort posts by date (newest first)
        // Since we don't have real dates, they're sorted by the order in POST_FILES array
        posts.sort((a, b) => b.date - a.date);
        
        return {
            success: true,
            posts
        };
    } catch (error) {
        console.error('Error loading blog posts:', error);
        return {
            success: false,
            error: error.message
        };
    }
} 