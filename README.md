# termycommit

AI-powered git commit message generator using OpenRouter API.

[![npm version](https://img.shields.io/npm/v/termycommit)](https://www.npmjs.com/package/termycommit)
[![npm downloads](https://img.shields.io/npm/dm/termycommit)](https://www.npmjs.com/package/termycommit)

termycommit helps you generate smart and meaningful commit messages for your git repository using AI. Just stage your changes and let termycommit create the perfect commit message for you.

## Features

- Generate smart commit messages from git diff
- Supports both your own API key and free trials (5 uses)
- Clean and beautiful CLI interface with ASCII art header
- Option to push to remote after commit
- Tracks free trial usage
- Handles API rate limits gracefully

## Installation

```bash
npm install -g termycommit
```

## Quick Start

```bash
# Stage your changes
git add .

# Run termycommit
termycommit
```

## Usage Guide

### Step 1: Stage Your Changes

Before running termycommit, stage the files you want to commit:

```bash
# Stage specific file
git add filename.js

# Stage all changes
git add .

# Stage all changes in a folder
git add src/
```

### Step 2: Run termycommit

```bash
termycommit
```

### Step 3: Follow the Prompts

1. **Continue?** - Press Enter to start
2. **Choose API option** - Select your own key or free trials
3. **Wait for AI** - Generates commit message
4. **Choose action** - Accept & Commit / Regenerate / Exit
5. **Push?** - Choose to push to remote or not

## API Key Setup

### Option 1: Your Own API Key

Using your own API key gives you unlimited commits without worrying about free trial limits.

1. Visit [OpenRouter](https://openrouter.ai/keys) to get a free API key
2. When prompted in termycommit, select "Use my own API key"
3. Enter your API key when asked
4. The key is saved to `.env` file for future use

Your key stays on your machine and is never shared.

### Option 2: Free Trials

termycommit provides 5 free trial commits using a default API key. This is useful for testing or occasional use.

- Shows remaining trials on each run
- When exhausted, you'll be prompted to add your own key
- Trials reset when you add your own API key

## Commands

```bash
# Basic usage
termycommit

# Stage specific file
git add index.js

# Stage all changes
git add .

# Stage specific folder
git add src/

# Check staged files
git status

# Commit manually (without AI)
git commit -m "your message"

# Push to remote
git push
```

## Troubleshooting

### No staged changes found

```
Error: No staged changes
```

**Solution:** Stage your files first with `git add <filename>`

### Rate limit exceeded

```
Error: Rate limit exceeded
```

**Solution:** Add your own API key for unlimited usage

### Free trials exhausted

```
Error: Free trials exhausted
```

**Solution:** Use your own API key when prompted

### Permission denied (Linux/Mac)

If you get permission errors:

```bash
sudo npm install -g termycommit
```

Or fix npm permissions:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g termycommit
```

## How It Works

termycommit uses the following flow:

1. Reads your staged git changes using `git diff --cached`
2. Sends the diff to OpenRouter AI API
3. AI generates a conventional commit message (feat:, fix:, docs:, etc.)
4. Displays the suggested message
5. If accepted, commits with the message
6. Optionally pushes to remote

## Requirements

- Node.js 18 or higher
- Git installed and configured
- An OpenRouter API key (optional - 5 free trials included)

## Project Structure

```
termycommit/
├── bin/
│   └── cli.js              # Entry point
├── src/
│   ├── index.js            # Main application flow
│   ├── api/
│   │   └── openrouter.js   # OpenRouter API integration
│   ├── ui/
│   │   ├── header.js       # ASCII header display
│   │   └── spinner.js      # Loading spinner
│   └── utils/
│       ├── apiKey.js       # API key management
│       └── git.js          # Git operations
├── package.json
└── README.md
```

## Security

- Your API key is stored locally in the `.env` file
- The `.env` file is ignored by git
- Keys are never sent to any server except OpenRouter
- Default free trials use a shared key for demonstration

## License

ISC

## Author

termycommit is created and maintained by the community.

## Support

If you encounter any issues or have suggestions:

- Open an issue on GitHub
- Check the source code
- Fork and contribute

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the AI API
- [Chalk](https://github.com/chalk/chalk) for beautiful CLI colors
- [Prompts](https://github.com/terkelg/prompts) for interactive prompts
