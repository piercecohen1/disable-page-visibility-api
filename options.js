/**
 * Disable Page Visibility API - Options Page
 * Copyright (C) 2021 Marvin Schopf
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

// save settings to chrome.storage.sync
function saveSettings() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const patterns = document.getElementById('patterns').value
        .split('\n')
        .map(p => p.trim())
        .filter(p => p.length > 0);
    
    chrome.storage.sync.set({
        mode: mode,
        patterns: patterns
    }, function() {
        // show saved status
        const status = document.getElementById('status');
        status.textContent = 'Settings saved!';
        status.style.color = '#4CAF50';
        setTimeout(function() {
            status.textContent = '';
        }, 2000);
    });
}

// load settings from chrome.storage.sync
function loadSettings() {
    chrome.storage.sync.get({
        mode: 'all',
        patterns: []
    }, function(items) {
        // set the mode
        document.getElementById('mode-' + items.mode).checked = true;
        
        // set the patterns
        document.getElementById('patterns').value = items.patterns.join('\n');
        
        // show/hide patterns section based on mode
        updatePatternsVisibility();
    });
}

// show/hide the patterns section based on selected mode
function updatePatternsVisibility() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const patternsSection = document.getElementById('patterns-section');
    
    if (mode === 'whitelist' || mode === 'blacklist') {
        patternsSection.style.display = 'block';
    } else {
        patternsSection.style.display = 'none';
    }
}

// initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    
    // add event listeners
    document.getElementById('save').addEventListener('click', saveSettings);
    
    // add mode change listeners
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', updatePatternsVisibility);
    });
});