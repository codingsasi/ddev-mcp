# Documentation Organization

## Overview

All documentation files have been moved to the `docs/` folder to keep the project root clean and organized.

## Structure

```
ddev-mcp/
├── README.md                    # Main project README (stays in root)
├── docs/                        # All documentation files
│   ├── README.md               # Documentation index
│   ├── CONTRIBUTING.md         # Contributing guide
│   ├── EXTENDING.md            # Extending guide
│   ├── USAGE_EXAMPLES.md       # Usage examples
│   ├── WORDPRESS_EXAMPLES.md   # WordPress examples
│   ├── USER_INPUT_EXAMPLES.md  # User input examples
│   ├── SIMPLE_USER_INPUT_SUMMARY.md  # User input summary
│   ├── PLATFORM_TEST.md        # Platform.sh testing
│   ├── PLATFORM_REDEPLOY_SUMMARY.md  # Platform.sh redeploy
│   └── DOCUMENTATION_ORGANIZATION.md # This file
└── ... (other project files)
```

## Changes Made

1. **Created `docs/` folder** - Central location for all documentation
2. **Moved 8 documentation files** - All .md files except main README.md
3. **Updated main README.md** - Updated links to point to docs/ folder
4. **Created docs/README.md** - Navigation index for all documentation
5. **Organized by category** - Documentation grouped by purpose

## Benefits

✅ **Clean root directory** - Only essential files in project root  
✅ **Organized documentation** - All docs in one place  
✅ **Easy navigation** - docs/README.md provides index  
✅ **Maintained links** - All references updated correctly  
✅ **Scalable structure** - Easy to add new documentation  

## Usage

- **Main documentation**: See [docs/README.md](README.md) for complete index
- **Quick reference**: Main [README.md](../README.md) has key links
- **Adding new docs**: Place new .md files in `docs/` folder
- **Updating links**: Use `docs/filename.md` format for internal links

The documentation is now well-organized and easy to navigate! 🎉
