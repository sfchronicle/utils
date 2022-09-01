#!/bin/bash

# Run with ./deploy-git.sh
# Super simple script to prep for git deploy

echo "Copying build to export..."
cp -a public/. "./public_export"
