document.addEventListener('DOMContentLoaded', () => {
    const output = document.getElementById('terminalOutput');
    const input = document.getElementById('terminalInput');

    const commands = {
        'help': 'Available commands: ls, cat, scan, clear, help, submit [flag]',
        'ls': 'restricted_data.vault  system_logs.txt  config.php',
        'cat system_logs.txt': 'Log entry [14:22]: User "admin" changed password hint to "Forge the Future 2026"',
        'cat config.php': 'Permission denied. Root access required.',
        'scan': 'Scanning network... [1] open port found: 8080 (Service: ForgeVault-v2)',
        'clear': () => { output.innerHTML = ''; return ''; },
        'submit': (args) => {
            const flag = args.join(' ');
            if (flag === 'CYBERFORGE{I_AM_THE_ENGINEER}') {
                CyberState.grantXP(50, 'ctf');
                return '<span class="flag-success">[SUCCESS] Flag Accepted! +50 XP awarded. You are a true operative.</span>';
            }
            return '<span class="flag-fail">[ERROR] Incorrect flag. Keep hunting.</span>';
        }
    };

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim();
            if (!val) return;

            const [cmd, ...args] = val.split(' ');

            // Add to output
            const line = document.createElement('div');
            line.className = 'terminal-line';
            line.innerHTML = `<span class="prompt">root@cyberforge:~$</span> ${val}`;
            output.appendChild(line);

            // Process command
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';

            if (commands[val]) {
                const res = commands[val];
                responseLine.innerHTML = typeof res === 'function' ? res() : res;
            } else if (commands[cmd]) {
                responseLine.innerHTML = commands[cmd](args);
            } else {
                responseLine.innerHTML = `Command not found: ${cmd}`;
            }

            if (responseLine.innerHTML) {
                output.appendChild(responseLine);
            }

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });

    // Keep focus on input
    document.addEventListener('click', () => input.focus());
});
