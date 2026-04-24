# tcxcommit

AI-powered git commit message generator that writes your commit messages for you!

## Description

tcxcommit is a command-line tool that uses artificial intelligence to generate meaningful and conventional git commit messages. Simply stage your changes and let tcxcommit create the perfect commit message for you. It supports both free trials and your own OpenRouter API key.

## Features

- AI-powered commit message generation
- Conventional commit format support (feat:, fix:, docs:, refactor:, etc.)
- Free to start with 10 trial commits
- Option to use your own OpenRouter API key for unlimited usage
- Automatic change staging
- Git push support after commit
- Clean and beautiful terminal interface
- Rate limit handling
- Network error handling

## Installation

### Prerequisites

- Node.js 18 or higher
- Git installed and configured
- Internet connection (for AI API calls)

### Install via npm

```bash
npm install -g tcxcommit
```

### Install via npx (no installation required)

```bash
npx tcxcommit
```

## Usage

### Basic Usage

1. Navigate to your git repository
2. Make some changes to your files
3. Run the following command:

```bash
tcxcommit
```

4. Follow the interactive prompts:
   - Press Enter to continue
   - Choose API option (free trials or your own key)
   - Wait for AI to generate commit message
   - Accept, regenerate, or exit
   - Choose to push to remote after commit

### Using with Git

tcxcommit automatically stages your changes before generating the commit message. You can also manually stage files:

```bash
# Stage specific file
git add filename.js

# Stage all changes
git add .

# Stage specific folder
git add src/
```

## API Key Options

### Option 1: Free Trials

By default, tcxcommit provides 10 free trial commits using OpenRouter's free AI model. This is useful for testing or occasional use.

- No API key required
- 10 free commits included
- Shows remaining trials on each run
- When exhausted, prompts to add your own key

### Option 2: Your Own API Key

For unlimited commits, you can use your own OpenRouter API key:

1. Visit [OpenRouter.ai](https://openrouter.ai/keys) to get a free API key
2. Run `tcxcommit`
3. Select "Use my own API key" when prompted
4. Enter your API key
5. The key is saved locally for future use

Your API key is stored securely on your machine and is never shared with anyone except OpenRouter for generating commit messages.

## Commands

```bash
# Start tcxcommit
tcxcommit

# Or use npx without installing
npx tcxcommit
```

## How It Works

tcxcommit follows this simple flow:

1. Checks for git repository in current directory
2. Stages all changes automatically using `git add .`
3. Gets the staged diff using `git diff --cached`
4. Sends the diff to OpenRouter AI API
5. AI generates a conventional commit message
6. Displays the suggested message
7. User accepts, regenerates, or exits
8. If accepted, commits with the generated message
9. Optionally pushes to remote repository

## Troubleshooting

### No changes found

```
Error: No changes found
```

Solution: Make some changes to your files and try again. tcxcommit requires at least one staged change to generate a commit message.

### Rate limit exceeded

```
Error: Rate limit exceeded
```

Solution: Use your own OpenRouter API key for unlimited commits. The free trials have rate limits.

### Network error

```
Error: Network error. Please check your internet connection.
```

Solution: Ensure you have an active internet connection and try again.

### Git not installed

```
Error: Git is not installed or not in PATH
```

Solution: Install Git and ensure it's available in your system PATH.

### Not a git repository

```
Error: Not a git repository
```

Solution: Initialize a git repository first:

```bash
git init
```

### Permission denied (Linux/Mac)

If you get permission errors during installation:

```bash
sudo npm install -g tcxcommit
```

Or fix npm permissions:

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
npm install -g tcxcommit
```

## Configuration

tcxcommit stores its configuration in the following location:

- Linux/macOS: `~/.tcxcommit/config.json`
- Windows: `C:\Users\YourUsername\.tcxcommit\config.json`

The configuration file contains:
- Your API key (if set)
- Number of free trials remaining

## Project Structure

```
tcxcommit/
├── src/
│   ├── cli.ts              # Entry point
│   ├── index.ts            # Main application logic
│   ├── api/
│   │   └── openrouter.ts   # OpenRouter API integration
│   ├── ui/
│   │   ├── header.ts       # Terminal header display
│   │   └── spinner.ts      # Loading spinner
│   └── utils/
│       ├── apiKey.ts       # API key management
│       └── git.ts          # Git operations
├── dist/                   # Compiled JavaScript (published)
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- Your API key is stored locally in the configuration file
- Keys are never sent to any server except OpenRouter
- The default free trials use a shared key for demonstration purposes
- No data is collected or analytics are sent anywhere

## Technologies Used

- Node.js - JavaScript runtime
- TypeScript - Programming language
- OpenRouter - AI API provider
- Chalk - Terminal string styling
- Prompts - Interactive CLI prompts

## License

ISC License

## Author

tcxcommit is created and maintained by the community.

## Support

If you encounter any issues or have suggestions:

- Open an issue on GitHub: https://github.com/sahilcodexx/tcxcommit/issues
- Check the source code on GitHub: https://github.com/sahilcodexx/tcxcommit

## Acknowledgments

- [OpenRouter](https://openrouter.ai/) for providing the AI API
- [Chalk](https://github.com/chalk/chalk) for beautiful terminal colors
- [Prompts](https://github.com/terkelg/prompts) for interactive CLI prompts
