document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('json-form');
    const jsonInput = document.getElementById('json-input');
    const jsonOutput = document.getElementById('json-output');
    const errorMessage = document.getElementById('error-message');
    const submitBtn = document.getElementById('submit-btn');
    const spinner = document.getElementById('loading-spinner');

    // Syntax highlighting for JSON
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset state
        errorMessage.textContent = '';
        jsonOutput.innerHTML = '';
        
        const rawInput = jsonInput.value.trim();
        if (!rawInput) {
            errorMessage.textContent = 'Please enter JSON data.';
            return;
        }

        let parsedData;
        try {
            parsedData = JSON.parse(rawInput);
        } catch (error) {
            errorMessage.textContent = 'Invalid JSON format.';
            return;
        }

        // Prepare for request
        submitBtn.disabled = true;
        spinner.classList.remove('hidden');

        try {
            const response = await fetch('http://127.0.0.1:8000/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: parsedData })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Artificial delay just to show off the cool spinner for a moment
            setTimeout(() => {
                spinner.classList.add('hidden');
                jsonOutput.innerHTML = syntaxHighlight(result);
                submitBtn.disabled = false;
            }, 300);

        } catch (error) {
            spinner.classList.add('hidden');
            errorMessage.textContent = 'Failed to connect to the server.';
            jsonOutput.innerHTML = `<span class="error-text">${error.message}</span>`;
            submitBtn.disabled = false;
        }
    });

    // Handle tab in textarea
    jsonInput.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;
            this.value = this.value.substring(0, start) + "  " + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
        }
    });
});
