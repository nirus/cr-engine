import { globby } from 'globby'
import grayMatter from 'gray-matter'
import { promises as fs } from 'node:fs'
import path, { dirname } from 'node:path'

/**
 * Extract slug from file path
 * @param {string} filePath - Path to the markdown file
 * @returns {string} The slug extracted from the path
 */
const getSlugFromPathname = filePath => {
  const removeIndexFile = filePath.replace('index.md', '')
  return path.basename(removeIndexFile)
}

/**
 * Clean markdown text for better search and display
 * @param {string} text - Raw markdown text
 * @returns {string} Clean text without markdown formatting
 */
const cleanMarkdown = text => {
  if (!text) return ''

  return (
    text
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold/italic markdown
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove image syntax
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      // Remove blockquotes
      .replace(/^>\s+/gm, '')
      // Remove list markers
      .replace(/^[\s]*[-*+]\s+/gm, '')
      .replace(/^[\s]*\d+\.\s+/gm, '')
      // Remove horizontal rules
      .replace(/^[\s]*[-*_]{3,}[\s]*$/gm, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

/**
 * Process a single post directory
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<Object>} Processed post data
 */
const processPost = async filePath => {
  try {
    const postDir = dirname(filePath)
    const slug = getSlugFromPathname(filePath)

    // Read files in parallel for better performance
    const [contents, claimData] = await Promise.all([
      fs.readFile(filePath, 'utf8'),
      fs.readFile(path.join(postDir, 'claim.json'), 'utf8'),
    ])

    const { title, description, tags, pubDate, author } = JSON.parse(claimData)
    const { content } = grayMatter(contents)

    // Clean the content for better search and display
    const cleanContent = cleanMarkdown(content)

    return {
      slug,
      category: 'blog',
      title,
      description,
      tags,
      pubDate,
      author,
      body: content, // Keep original for search
      bodyClean: cleanContent, // Add clean version for display
    }
  } catch (error) {
    console.error(`Error processing post at ${filePath}:`, error.message)
    return null
  }
}

/**
 * Main function to generate search index
 */
const generateSearchIndex = async () => {
  try {
    // Prepare directories
    const srcDir = path.join(process.cwd(), 'src')
    const distDir = path.join(process.cwd(), 'dist')
    const contentDir = path.join(srcDir, 'pages', 'posts')
    const contentFilePattern = path.join(contentDir, '**/*.md')
    const indexFile = path.join(distDir, 'search-index.json')

    // Ensure dist directory exists
    await fs.mkdir(distDir, { recursive: true })

    // Get all markdown files
    const contentFilePaths = await globby([contentFilePattern])

    if (contentFilePaths.length === 0) {
      console.log('No markdown files found to index')
      return
    }

    console.log(`Found ${contentFilePaths.length} posts to index...`)

    // Process all posts in parallel for better performance
    const postPromises = contentFilePaths.map(processPost)
    const results = await Promise.all(postPromises)

    // Filter out any failed posts and sort by publication date
    const index = results
      .filter(post => post !== null)
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))

    // Write the index file
    await fs.writeFile(indexFile, JSON.stringify(index))

    console.log(
      `✅ Search-JSON: Indexed ${index.length} documents from ${contentDir} to ${indexFile}`,
    )

    // Log any failed posts
    const failedCount = results.length - index.length
    if (failedCount > 0) {
      console.warn(`⚠️  Failed to process ${failedCount} posts`)
    }
  } catch (error) {
    console.error('❌ Error generating search index:', error.message)
    process.exit(1)
  }
}

// Run the script
generateSearchIndex()

// Test markdown cleaning (uncomment to test)
/*
const testMarkdown = `
# Header 1
## Header 2

This is **bold** and *italic* text.

- List item 1
- List item 2

\`\`\`js
console.log('code block');
\`\`\`

[Link text](https://example.com)

> Blockquote text
`

console.log('Original:', testMarkdown)
console.log('Cleaned:', cleanMarkdown(testMarkdown))
*/
