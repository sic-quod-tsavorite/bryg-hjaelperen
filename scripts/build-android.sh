#!/bin/bash

# Build Android APK with correct Java version
# Temporarily switches to JDK 17 (required by Gradle), builds, then restores JDK 25

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Switching to JDK 17..."
sudo archlinux-java set java-17-openjdk

echo "Building Android APK..."
cd "$PROJECT_DIR"
bun run build:android

echo "Restoring JDK 25..."
sudo archlinux-java set java-25-openjdk

echo "Current Java version:"
archlinux-java status

echo "Done!"
