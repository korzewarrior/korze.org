<?php
header('Content-Type: application/json');

// Function to extract title from markdown content
function extractTitle($content) {
    // Look for markdown heading at the start (## Title or ### Title)
    if (preg_match('/^#+\s*(.+)$/m', $content, $matches)) {
        return trim($matches[1]);
    }
    // Fallback: If no heading found, use first line or a default
    $firstLine = strtok($content, "\n");
    return trim($firstLine) ?: 'Untitled Post';
}

// Function to get post creation/modification date
function getPostDate($filePath) {
    // Use file modification time as the post date
    return filemtime($filePath);
}

// Directory containing blog posts
$postsDir = 'posts';
$posts = [];

// Check if directory exists
if (is_dir($postsDir)) {
    // Get all markdown files
    $files = glob($postsDir . '/*.md');
    
    foreach ($files as $file) {
        $content = file_get_contents($file);
        if ($content !== false) {
            $filename = basename($file);
            $title = extractTitle($content);
            $date = getPostDate($file);
            
            $posts[] = [
                'filename' => $filename,
                'title' => $title,
                'content' => $content,
                'date' => $date
            ];
        }
    }
    
    // Sort posts by date (newest first)
    usort($posts, function($a, $b) {
        return $b['date'] - $a['date'];
    });
}

// Return posts as JSON
echo json_encode([
    'success' => true,
    'posts' => $posts
]);
?> 