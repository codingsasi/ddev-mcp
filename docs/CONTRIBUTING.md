# Contributing to DDEV MCP

Thank you for your interest in contributing to DDEV MCP! This guide will help you get started.

## 🚀 Quick Start

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ddev-mcp.git
   cd ddev-mcp
   npm install
   ```

2. **Development Setup**
   ```bash
   npm run build
   npm test
   npm run dev
   ```

## 🛠️ Development Guidelines

### **Code Standards**
- **TypeScript:** Strict mode enabled
- **ESLint:** Follow existing patterns
- **Testing:** Add tests for new features
- **Documentation:** Update README for new tools

### **Adding New Tools**

1. **Define Tool Schema** in `src/server/tools.ts`:
   ```typescript
   {
     name: 'ddev_my_tool',
     description: 'Description of what the tool does',
     inputSchema: {
       type: 'object',
       properties: {
         projectPath: {
           type: 'string',
           description: 'Path to the DDEV project directory'
         },
         // Add your parameters here
       },
       required: ['projectPath'] // Always require projectPath
     }
   }
   ```

2. **Implement Operation** in `src/ddev/operations.ts`:
   ```typescript
   async myTool(options: DDEVCommandOptions & { /* your params */ }): Promise<CommandResult> {
     // Use native DDEV commands when possible
     return await this.commandExecutor.executeDDEV('my-command', args, execOptions);
   }
   ```

3. **Add Server Handler** in `src/server/index.ts`:
   ```typescript
   case 'ddev_my_tool':
     return await this.ddevOps.myTool(args);
   ```

4. **Add Tests** in `tests/server.test.ts`

### **Best Practices**

#### **Use Native DDEV Commands**
```typescript
// ✅ Good - Native command
await this.commandExecutor.executeDDEV('redis-cli', ['PING'], execOptions);

// ❌ Avoid - Complex exec workarounds
await this.commandExecutor.executeDDEV('exec', ['--service=redis', 'redis-cli', 'PING'], execOptions);
```

#### **Always Require Project Path**
```typescript
// ✅ Good - Safe for AI usage
required: ['projectPath']

// ❌ Avoid - Can cause wrong directory operations
// No required fields
```

#### **AI-Friendly Descriptions**
```typescript
// ✅ Good - Clear for AI understanding
description: 'Execute Redis CLI commands (non-interactive, returns output)'

// ❌ Avoid - Vague or technical jargon
description: 'Redis interface'
```

## 🧪 Testing

### **Run Tests**
```bash
npm test
npm run test:watch
```

### **Manual Testing**
```bash
# Test with real DDEV project
echo '{"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": "ddev_status", "arguments": {"projectPath": "/path/to/project"}}}' | node dist/index.js
```

### **Integration Testing**
Test with Cursor IDE:
1. Build the project: `npm run build`
2. Update `~/.cursor/mcp.json` to point to your development version
3. Restart Cursor
4. Test with AI assistant

## 📝 Supported DDEV Add-ons

When adding support for new DDEV add-ons:

1. **Check Official Add-on** - Look for official `ddev/ddev-*` add-ons
2. **Use Native Commands** - Prefer `ddev command` over `ddev exec`
3. **Service Awareness** - Route commands to correct containers
4. **Documentation** - Reference official add-on docs

### **Current Add-on Support**
- ✅ **Redis** - `ddev redis-cli` commands
- ✅ **Solr** - `ddev solr` and `ddev solr-zk` commands
- ✅ **Platform.sh** - `ddev platform` commands
- ✅ **Playwright** - `ddev playwright` commands

## 🐛 Reporting Issues

1. **Check Existing Issues** - Search for similar problems
2. **Provide Context** - Include DDEV version, project type, error output
3. **Minimal Reproduction** - Provide steps to reproduce the issue

## 📋 Pull Request Process

1. **Create Feature Branch** - `git checkout -b feature/my-feature`
2. **Make Changes** - Follow coding standards
3. **Add Tests** - Ensure new functionality is tested
4. **Update Documentation** - Update README if needed
5. **Test Thoroughly** - Run `npm test` and manual testing
6. **Submit PR** - Clear description of changes and why they're needed

## 🏗️ Architecture

### **Project Structure**
```
src/
├── server/          # MCP server implementation
│   ├── index.ts     # Main server class
│   └── tools.ts     # Tool definitions
├── ddev/            # DDEV operations
│   └── operations.ts # Core DDEV command implementations
├── utils/           # Utilities
│   ├── logger.ts    # Logging
│   ├── command.ts   # Command execution
│   └── directory.ts # Directory utilities
├── types/           # TypeScript definitions
│   └── index.ts     # Type definitions
└── index.ts         # CLI entry point
```

### **Key Principles**
1. **Native DDEV First** - Use authentic DDEV commands
2. **Service Awareness** - Route to correct containers
3. **AI Optimized** - Non-interactive with structured output
4. **Type Safety** - Full TypeScript coverage
5. **Error Handling** - Graceful failures with clear messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the official [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- Designed for [DDEV](https://ddev.readthedocs.io/) development environments

---

**Ready to contribute? We'd love your help making DDEV MCP even better!** 🚀
