/**
 * Disable Page Visibility API
 * Copyright (C) 2021 Marvin Schopf
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// check if the current URL matches any of the regex patterns
function matchesPatterns(url, patterns) {
	for (const pattern of patterns) {
		try {
			const regex = new RegExp(pattern);
			if (regex.test(url)) {
				return true;
			}
		} catch (e) {
			// invalid regex pattern, skip it
			console.error('Invalid regex pattern:', pattern, e);
		}
	}
	return false;
}

// apply the visibility API blocking
function applyBlocking() {
	window.addEventListener(
		"visibilitychange",
		function (event) {
			event.stopImmediatePropagation();
		},
		true
	);

	window.addEventListener(
		"webkitvisibilitychange",
		function (event) {
			event.stopImmediatePropagation();
		},
		true
	);

	window.addEventListener(
		"blur",
		function (event) {
			event.stopImmediatePropagation();
		},
		true
	);
}

// load settings and apply blocking if needed
chrome.storage.sync.get({
	mode: 'all',
	patterns: []
}, function(items) {
	const currentUrl = window.location.href;
	const mode = items.mode;
	const patterns = items.patterns;
	
	let shouldApply = false;
	
	if (mode === 'all') {
		// apply to all websites
		shouldApply = true;
	} else if (mode === 'whitelist') {
		// only apply if URL matches one of the patterns
		shouldApply = matchesPatterns(currentUrl, patterns);
	} else if (mode === 'blacklist') {
		// apply unless URL matches one of the patterns
		shouldApply = !matchesPatterns(currentUrl, patterns);
	}
	
	if (shouldApply) {
		applyBlocking();
	}
});
