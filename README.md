# Web Scraper Helper Chrome Extension

This Chrome extension helps you record website interactions for web scraping purposes.

## Features

- Record clicks and their locations
- Capture element text content
- Track page navigations
- Export data to CSV format

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this extension's directory

## Usage

1. Click the extension icon to open the popup
2. Click "Start Recording" to begin capturing interactions
3. Browse the website normally - all clicks and navigations will be recorded
4. Click "Export to CSV" to download the captured data

## Data Format

The exported CSV contains:
- Timestamp
- Action (click/navigation)
- URL
- Element Text

## Notes

- The extension records all clicks while active
- Data persists until exported or cleared
- Recording status is maintained across page refreshes