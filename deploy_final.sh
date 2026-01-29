#!/bin/bash
# Aleo Deployment Script for WSL
# Usage: ./deploy_final.sh

# Stop on erro
set -e

echo "=================================================="
echo "   🚀 AleoDAO Final Deployment Script (WSL)      "
echo "=================================================="

# Check if leo is installed
if ! command -v leo &> /dev/null; then
    echo "❌ Error: 'leo' command not found. Please ensure Leo CLI is installed and in your PATH."
    echo "Tip: Try running 'source $HOME/.cargo/env' if you just installed it."
    exit 1
fi

# Request Private Key
echo -n "Enter your Private Key (APrivateKey1...): "
read -s PRIVATE_KEY
echo
if [ -z "$PRIVATE_KEY" ]; then
    echo "❌ Private Key cannot be empty."
    exit 1
fi

export PRIVATE_KEY=$PRIVATE_KEY
# Using a slightly higher fee to ensure inclusion
PRIORITY_FEE=2000000 
# Endpoint: Provable (Formerly Aleo)
ENDPOINT="https://api.explorer.provable.com/v1"

echo "Using Endpoint: $ENDPOINT"
echo "Priority Fee: $PRIORITY_FEE"

deploy() {
    folder=$1
    program=$2
    
    echo ""
    echo "--------------------------------------------------"
    echo "📂 Processing: $folder ($program)"
    echo "--------------------------------------------------"
    
    if [ ! -d "programs/$folder" ]; then
        echo "❌ Error: Directory programs/$folder does not exist."
        exit 1
    fi

    cd "programs/$folder"
    
    echo "🧹 Cleaning build..."
    leo clean
    
    echo "🚀 Deploying..."
    # Note: If this fails with 'unknown option --priority-fee', try '--priority-fees'
    leo deploy --network testnet --endpoint "$ENDPOINT" --priority-fee "$PRIORITY_FEE" --private-key "$PRIVATE_KEY" --broadcast "$program"
    
    status=$?
    cd ../..
    
    if [ $status -ne 0 ]; then
        echo "❌ Deployment of $program failed!"
        echo "⚠️  Common Fixes:"
        echo "    1. Check if the network is up (status 500 often means network issues)."
        echo "    2. Verify you have credits in your account."
        exit $status
    else
        echo "✅ $program deployed successfully!"
        # Small pause to let the network propagate/nonce update
        echo "⏳ Waiting 5 seconds before next deployment..."
        sleep 5
    fi
}

# Deploy order matters due to dependencies
deploy "dao_registry" "ad_registry_5821.aleo"
deploy "proposal" "ad_proposal_5821.aleo"
deploy "private_vote" "ad_vote_5821.aleo"

echo ""
echo "=================================================="
echo "🎉 ALL CONTRACTS DEPLOYED SUCCESSFULLY!"
echo "=================================================="
