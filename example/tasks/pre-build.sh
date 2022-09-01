#!/bin/bash

# Get ready to build this project!

echo "Checking if remote data needs to be pulled..."
sheets=$(node -pe 'JSON.parse(process.argv[1]).GOOGLE_SHEETS' "$(cat project-config.json)")
docs=$(node -pe 'JSON.parse(process.argv[1]).GOOGLE_DOCS' "$(cat project-config.json)")

# If length of the string is greater than 2, needs running
if [ ${#sheets} -gt 2 ]; then
	npm run sheets
fi

if [ ${#docs} -gt 2 ]; then
	npm run docs
fi

# Special pre-build code follows if needed: 
