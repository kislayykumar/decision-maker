#!/bin/bash

echo "🚀 Smart Decision Helper - Quick Setup Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping .env.local creation"
    else
        cp .env.example .env.local
        echo "✅ Created .env.local from .env.example"
    fi
else
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your MongoDB connection string"
echo "2. Generate a NextAuth secret: openssl rand -base64 32"
echo "3. Add the secret to .env.local as NEXTAUTH_SECRET"
echo "4. Run 'npm run dev' to start the development server"
echo "5. Visit http://localhost:3000"
echo ""
echo "For more information, see README.md"