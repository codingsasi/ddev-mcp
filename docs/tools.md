# DDEV MCP Tools Reference

This document verifies each MCP tool against the **DDEV CLI** and **local docs**.  
**"What AI sees"** is the full tool description shown in the tools list: summary, usage, and how to get more info (`ddev help <command>`).  
Each section includes the **ddev help** output for that command so the doc is self-contained.

Sources: `ddev <command> --help`, `docs.ddev.com/en/stable/users/usage/`.

---

## 1. `ddev_start`

| Item | Content |
|------|--------|
| **What AI sees** | Start a DDEV project environment. Initializes and configures the web server and database containers. Run from project directory or pass project name(s). **Usage:** `ddev start [projectname ...] [flags]` **Flags:** -a/--all, -y/--skip-confirmation, --skip-hooks **For full options:** `ddev help start` |
| **Arguments** | `projectPath` (required), `skipHooks`, `skipConfirmation` |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help start

```
Start initializes and configures the web server and database containers
to provide a local development environment. You can run 'ddev start' from a
project directory to start that project, or you can start stopped projects in
any directory by running 'ddev start projectname [projectname ...]'

Usage:
  ddev start [projectname ...] [flags]

Aliases:
  start, add

Examples:
ddev start
ddev start <project1> <project2>
ddev start --all

Flags:
  -a, --all                 Start all projects
  -h, --help                help for start
      --no-cache            Build Docker images without using cache
      --profiles string     Start optional comma-separated docker compose profiles
  -y, --skip-confirmation   Skip confirmation steps

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 2. `ddev_stop`

| Item | Content |
|------|--------|
| **What AI sees** | Stop and remove the containers of a DDEV project. Non-destructive: leaves database and code intact. Run from project dir or pass project name(s). **Usage:** `ddev stop [projectname ...] [flags]` **For full options (e.g. --remove-data, --snapshot):** `ddev help stop` |
| **Arguments** | `projectPath` (required) |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help stop

```
Stop and remove the containers of a project. You can run 'ddev stop'
from a project directory to stop/remove that project, or you can stop/remove projects in
any directory by running 'ddev stop projectname [projectname ...]' or 'ddev stop -a'.

By default, stop is a non-destructive operation and will leave database
contents intact. It never touches your code or files directories.

To remove database contents and global listing,
use "ddev delete" or "ddev stop --remove-data".

Usage:
  ddev stop [projectname ...] [flags]

Flags:
  -a, --all              Stop and remove all running or container-stopped projects
  -h, --help             help for stop
  -O, --omit-snapshot    Omit/skip database snapshot
  -R, --remove-data      Remove stored project data (MySQL, logs, etc.)
  -S, --snapshot         Create database snapshot
  ...

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 3. `ddev_restart`

| Item | Content |
|------|--------|
| **What AI sees** | Restart a DDEV project: stops then starts named project(s). **Usage:** `ddev restart [projectname ...] [flags]` **Flags:** -a/--all, -y/--skip-confirmation **For full options:** `ddev help restart` |
| **Arguments** | `projectPath` (required) |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help restart

```
Stops named projects and then starts them back up again.

Usage:
  ddev restart [projects] [flags]

Examples:
ddev restart
ddev restart <project1> <project2>
ddev restart --all

Flags:
  -a, --all                 Restart all projects
  -h, --help                help for restart
  -y, --skip-confirmation   Skip confirmation steps

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 4. `ddev_describe`

| Item | Content |
|------|--------|
| **What AI sees** | Get a detailed description of a running DDEV project (name, location, URL, status, MySQL connection details, Mailpit, etc.). Aliases: describe, status, st. **Usage:** `ddev describe [projectname] [flags]` **For full options:** `ddev help describe` |
| **Arguments** | `projectPath` |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help describe

```
Get a detailed description of a running DDEV project. Describe provides basic
information about a DDEV project, including its name, location, url, and status.
It also provides details for MySQL connections, and connection information for
additional services like Mailpit.

Usage:
  ddev describe [projectname] [flags]

Aliases:
  describe, status, st, desc

Examples:
ddev describe
ddev describe <projectname>
ddev status
ddev st

Flags:
  -h, --help   help for describe

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 5. `ddev_list`

| Item | Content |
|------|--------|
| **What AI sees** | List DDEV projects and their status. Shows all by default; use activeOnly for running only. **Usage:** `ddev list [flags]` **Flags:** -A/--active-only, -t/--type **For full options:** `ddev help list` |
| **Arguments** | `activeOnly` |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help list

```
List projects. Shows all projects by default, shows active projects only with --active-only

Usage:
  ddev list [flags]

Aliases:
  list, l, ls

Examples:
ddev list
ddev list --active-only
ddev list -A
ddev list --type=cakephp
ddev list -t typo3

Flags:
  -A, --active-only                     If set, only currently active projects will be displayed.
  -h, --help                            help for list
  -t, --type string                     Show only projects of this type
  ...

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 6. `ddev_import_db`

| Item | Content |
|------|--------|
| **What AI sees** | Import a SQL dump file into the project. Supports .sql, .sql.gz, .sql.bz2, .sql.xz, .mysql, .zip, .tgz, .tar.gz. For archives, use extractPath for path inside archive. Target DB via targetDb (default "db"). **Usage:** `ddev import-db [project] [flags]` **MCP args → ddev:** src → --file, targetDb → --database, extractPath → --extract-path **For full options and examples:** `ddev help import-db` |
| **Arguments** | `projectPath`, `src`, `extractPath`, `targetDb` |
| **Verified** | Implementation uses --file, --database, --extract-path per CLI. |
| **Changes** | Fixed: src → --file=, targetDb → --database=; removed unsupported srcRaw and noActivatePlugins. |

### ddev help import-db

```
Import a SQL dump file into the project.

The database dump file can be provided as a SQL dump in a .sql, .sql.gz,
sql.bz2, sql.xz, .mysql, .mysql.gz, .zip, .tgz, or .tar.gz format.

For the zip and tar formats, the path to a .sql file within the archive
can be provided if it is not located at the top level of the archive.

An optional target database can also be provided; the default is the
default database named "db".

Also note the related "ddev mysql" command.

Usage:
  ddev import-db [project] [flags]

Examples:
  $ ddev import-db
  $ ddev import-db --file=.tarballs/junk.sql
  $ ddev import-db --file=.tarballs/junk.sql.gz
  $ ddev import-db --database=other_db --file=.tarballs/db.sql.gz
  $ ddev import-db --file=.tarballs/db.sql.bz2
  $ ddev import-db --file=.tarballs/db.sql.xz
  $ ddev import-db < db.sql
  $ ddev import-db my-project < db.sql
  $ gzip -dc db.sql.gz | ddev import-db

Flags:
  -d, --database string       Target database to import into (default "db")
      --extract-path string   Path to extract within the archive
  -f, --file .sql             Path to a SQL dump in .sql, `.tar`, `.tar.gz`, `.tar.bz2`, `.tar.xz`, `.tgz`, or `.zip` format
  -h, --help                  help for import-db
      --no-drop               Do not drop the database before importing
      --no-progress           Do not output progress

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 7. `ddev_export_db`

| Item | Content |
|------|--------|
| **What AI sees** | Dump a database to a file or stdout. Compression: gzip (default), bzip2, or xz. Target DB via targetDb (default "db"). **Usage:** `ddev export-db [project] [flags]` **MCP args → ddev:** file → -f/--file, targetDb → -d/--database, compressionType → --gzip\|--bzip2\|--xz **For full options and examples:** `ddev help export-db` |
| **Arguments** | `projectPath`, `file`, `compressionType` (gzip \| bzip2 \| xz), `targetDb` |
| **Verified** | Implementation uses --file, --database, --gzip/--bzip2/--xz per CLI. |
| **Changes** | Fixed: targetDb → --database=. |

### ddev help export-db

```
Dump a database to a file or to stdout.

Usage:
  ddev export-db [project] [flags]

Examples:
  $ ddev export-db --file=/tmp/db.sql.gz
  $ ddev export-db -f /tmp/db.sql.gz
  $ ddev export-db --gzip=false --file /tmp/db.sql
  $ ddev export-db > /tmp/db.sql.gz
  $ ddev export-db --gzip=false > /tmp/db.sql
  $ ddev export-db --database=additional_db --file=.tarballs/additional_db.sql.gz
  $ ddev export-db my-project --gzip=false --file=/tmp/my_project.sql

Flags:
      --bzip2             Use bzip2 compression
  -d, --database string   Target database to export from (default "db")
  -f, --file string       Path to a SQL dump file to export to
  -z, --gzip              Use gzip compression (default true)
  -h, --help              help for export-db
      --xz                Use xz compression

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 8. `ddev_logs`

| Item | Content |
|------|--------|
| **What AI sees** | Display stdout logs from DDEV services (docker logs). Default: web service; use service for e.g. db. **Usage:** `ddev logs [projectname] [flags]` **Flags:** -s/--service (web\|db), -f/--follow, --tail N **For full options:** `ddev help logs` |
| **Arguments** | `projectPath`, `service`, `follow`, `tail` |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help logs

```
Uses 'docker logs' to display stdout from the running services.

Usage:
  ddev logs [projectname] [flags]

Examples:
ddev logs
ddev logs -f
ddev logs -s db
ddev logs -s db [projectname]

Flags:
  -f, --follow           Follow the logs in real time.
  -h, --help             help for logs
  -s, --service string   Defines the service to retrieve logs from. [e.g. web, db] (default "web")
      --tail string      How many lines to show
  -t, --time             Add timestamps to logs

Global Flags:
      --skip-hooks   If true, any hook normally run by the command will be skipped.
```

---

## 9. `ddev_snapshot`

| Item | Content |
|------|--------|
| **What AI sees** | Create, list, restore, or cleanup database snapshots (stored in .ddev/db_snapshots). Restore with action=restore and snapshotName; use ddev snapshot restore --latest for latest. **Usage:** `ddev snapshot [projectname...] [flags]` \| `ddev snapshot restore [name] [flags]` **Actions:** create (optional name), list, restore (snapshotName or --latest), cleanup. **Flags:** -n/--name, -l/--list, -C/--cleanup, -y/--yes, -a/--all **For full options:** `ddev help snapshot`; `ddev snapshot restore --help` |
| **Arguments** | `projectPath`, `action` (create \| list \| restore \| cleanup), `name`, `snapshotName`, `all`, `yes` |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help snapshot

```
Uses mariabackup or xtrabackup command to create a database snapshot in the .ddev/db_snapshots folder. These are compatible with server backups using the same tools and can be restored with "ddev snapshot restore".

Usage:
  ddev snapshot [projectname projectname...] [flags]
  ddev snapshot [command]

Examples:
ddev snapshot
ddev snapshot --name some_descriptive_name
ddev snapshot --cleanup
ddev snapshot --cleanup -y
ddev snapshot --list
ddev snapshot --all

Available Commands:
  restore     Restore a project's database to the provided snapshot version.

Flags:
  -a, --all           Snapshot all projects. Will start the project if it is stopped or paused
  -C, --cleanup       Cleanup snapshots
  -h, --help          help for snapshot
  -l, --list          List snapshots
  -n, --name string   provide a name for the snapshot
  -y, --yes           Yes - skip confirmation prompt

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.

Use "ddev snapshot [command] --help" for more information about a command.
```

---

## 10. `ddev_exec`

| Item | Content |
|------|--------|
| **What AI sees** | Execute a shell command in the container for a DDEV service. Default: web; use service (e.g. db, redis, solr) for another. workdir maps to ddev --dir. **Usage:** `ddev exec [flags] [command] [command-flags]` **Flags:** -s/--service (default web), -d/--dir (execution directory) **For full options:** `ddev help exec` — plus a long list of common use cases (Drush, WP-CLI, Composer, Redis, Solr, mysql, npm, etc.) and note about dangerous commands. |
| **Arguments** | `projectPath`, `command` (required), `service`, `workdir` |
| **Verified** | Implementation uses --service, --dir per CLI. |
| **Changes** | Fixed: workdir → --dir=. |

### ddev help exec

```
Execute a shell command in the container for a service. Uses the web service by default. To run your command in the container for another service, run "ddev exec --service <service> <cmd>". If you want to use raw, uninterpreted command inside container use --raw as in example.

Usage:
  ddev exec [flags] [command] [command-flags]

Aliases:
  exec, .

Examples:
ddev exec ls /var/www/html
ddev exec --service db
ddev exec -s db
ddev exec -s solr (assuming an add-on service named 'solr')
ddev exec --raw -- ls -lR
ddev exec -s db -u root ls -la /root

Flags:
  -d, --dir string       Define the execution directory within the container
  -h, --help             help for exec
  -q, --quiet            Suppress detailed error output
      --raw              Use raw exec (do not interpret with Bash inside container) (default true)
  -s, --service string   Define the service to connect to. [e.g. web, db] (default "web")
  -u, --user string      Defines the user to use within the container

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 11. `ddev_poweroff`

| Item | Content |
|------|--------|
| **What AI sees** | Stop all DDEV projects and containers (equivalent to ddev stop -a --stop-ssh-agent). Stops Mutagen daemon if running. **Usage:** `ddev poweroff [flags]` **For full options:** `ddev help poweroff` |
| **Arguments** | _(none)_ |
| **Verified** | Matches CLI and docs. |
| **Changes** | None. |

### ddev help poweroff

```
ddev poweroff stops all projects and containers, equivalent to ddev stop -a --stop-ssh-agent

Usage:
  ddev poweroff [flags]

Aliases:
  poweroff, powerdown

Examples:
ddev poweroff

Flags:
  -h, --help   help for poweroff

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 12. `ddev_version`

| Item | Content |
|------|--------|
| **What AI sees** | Display the version of the DDEV binary and its components. **Usage:** `ddev version [flags]` **For full options:** `ddev help version` |
| **Arguments** | _(none)_ |
| **Verified** | Matches CLI. |
| **Changes** | None. |

### ddev help version

```
Display the version of this DDEV binary and its components.

Usage:
  ddev version [flags]

Flags:
  -h, --help   help for version

Global Flags:
  -j, --json-output   If true, user-oriented output will be in JSON format.
      --skip-hooks    If true, any hook normally run by the command will be skipped.
```

---

## 13. `ddev_help`

| Item | Content |
|------|--------|
| **What AI sees** | Get help for any DDEV command. Returns the same output as "ddev help &lt;command&gt;" or "ddev &lt;command&gt; &lt;subcommand&gt; --help". Use when you need exact flags, examples, or usage for a ddev command. **Usage:** ddev help [command] \| ddev &lt;command&gt; &lt;subcommand&gt; --help **Examples:** command="import-db" → ddev help import-db; command="snapshot", subcommand="restore" → ddev snapshot restore --help. Leave command empty for general ddev help. |
| **Arguments** | `command` (optional), `subcommand` (optional), `projectPath` (optional) |
| **Verified** | Runs `ddev help`, `ddev help <command>`, or `ddev <command> <subcommand> --help`. No project required. |

---

## 14. `message_complete_notification`

| Item | Content |
|------|--------|
| **What AI sees** | Send a simple OS notification to the user (MCP-only; not a ddev command). |
| **Arguments** | `title`, `message` (required) |
| **Verified** | N/A (no ddev CLI). |

---

## Summary of code/schema changes

| Location | Change |
|----------|--------|
| `src/ddev/operations.ts` | **importDB:** src → --file=, targetDb → --database=; dropped srcRaw/noActivatePlugins. |
| `src/ddev/operations.ts` | **exportDB:** targetDb → --database=. |
| `src/ddev/operations.ts` | **exec:** workdir → --dir=. |
| `src/server/tools.ts` | All DDEV tools: descriptions now include usage line and "For full options: ddev help <command>". import_db: removed srcRaw and noActivatePlugins from schema. |

---

## How to get more info for any command

- **In terminal:** `ddev help <command>` (e.g. `ddev help import-db`, `ddev help exec`).
- **Subcommands:** `ddev snapshot restore --help`.

---

## Configuration (environment)

| Variable | Default | Description |
|----------|---------|-------------|
| `DDEV_MCP_MAX_BUFFER` | `2097152` (2 MiB) | Max buffer size in bytes for command stdout+stderr. If a tool's output exceeds this, the process is killed and the call fails with `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`. Increase for very large output (e.g. big `ddev list`, long logs). |
