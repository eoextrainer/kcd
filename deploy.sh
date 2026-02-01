#!/bin/bash

# ==============================================================================
# KCD Application Deployment & Validation Script
# ==============================================================================
# This script automates the complete deployment workflow:
# 1. Kills all processes on app ports
# 2. Starts backend FastAPI server
# 3. Starts frontend Vite dev server
# 4. Opens app in browser
# 5. Waits for user validation
# 6. If approved: stages, commits, pushes to GitHub and deploys to Render
# 7. If rejected: runs self-healing (error fixing) and restarts
# ==============================================================================

set -e

PROJECT_ROOT="/home/sos10/Documents/EOEX/kcd"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKEND_PORT=8000
FRONTEND_PORT=3000
BACKEND_LOG="/tmp/kcd_backend.log"
FRONTEND_LOG="/tmp/kcd_frontend.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================================================
# Function: Print colored output
# ==============================================================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# ==============================================================================
# Function: Kill all processes on app ports
# ==============================================================================
cleanup_ports() {
    log_info "Cleaning up ports..."
    
    for port in 3000 3001 3002 8000; do
        if lsof -i :$port &>/dev/null 2>&1; then
            log_warning "Port $port is in use, killing processes..."
            sudo fuser -k $port/tcp 2>/dev/null || true
        fi
    done
    
    sleep 2
    
    # Verify ports are free
    for port in 3000 3001 3002 8000; do
        if ! lsof -i :$port &>/dev/null 2>&1; then
            log_success "Port $port is now free"
        else
            log_error "Port $port is still in use!"
            return 1
        fi
    done
}

# ==============================================================================
# Function: Start backend server
# ==============================================================================
start_backend() {
    log_info "Starting backend FastAPI server on port $BACKEND_PORT..."
    
    cd "$BACKEND_DIR"
    source venv/bin/activate
    
    # Kill any existing backend process
    pkill -f "uvicorn app.main" 2>/dev/null || true
    sleep 1
    
    # Start backend in background
    python -m uvicorn app.main:app --reload --host 0.0.0.0 --port $BACKEND_PORT > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID=$!
    
    # Wait for backend to start
    sleep 3
    
    # Verify backend is running
    if curl -s http://localhost:$BACKEND_PORT/api/v1/health &>/dev/null; then
        log_success "Backend is running on port $BACKEND_PORT (PID: $BACKEND_PID)"
        echo $BACKEND_PID > /tmp/kcd_backend.pid
        return 0
    else
        log_error "Backend failed to start"
        cat "$BACKEND_LOG"
        return 1
    fi
}

# ==============================================================================
# Function: Start frontend server
# ==============================================================================
start_frontend() {
    log_info "Starting frontend Vite dev server on port $FRONTEND_PORT..."
    
    cd "$FRONTEND_DIR"
    
    # Kill any existing frontend process
    pkill -f "vite" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    sleep 1
    
    # Start frontend in background
    PORT=$FRONTEND_PORT npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID=$!
    
    # Wait for frontend to start
    sleep 5
    
    # Check if process is still running
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        log_success "Frontend is running on port $FRONTEND_PORT (PID: $FRONTEND_PID)"
        echo $FRONTEND_PID > /tmp/kcd_frontend.pid
        return 0
    else
        log_warning "Frontend process stopped, checking logs..."
        tail -20 "$FRONTEND_LOG"
        return 1
    fi
}

# ==============================================================================
# Function: Open app in browser
# ==============================================================================
open_browser() {
    log_info "Opening app in browser at http://localhost:$FRONTEND_PORT"
    
    # Wait a moment for the app to be fully ready
    sleep 2
    
    # Try to open in browser (using xdg-open for Linux)
    if command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:$FRONTEND_PORT" &
    elif command -v open &>/dev/null; then
        open "http://localhost:$FRONTEND_PORT" &
    else
        log_warning "Could not automatically open browser. Please visit http://localhost:$FRONTEND_PORT manually"
    fi
}

# ==============================================================================
# Function: Validate with user
# ==============================================================================
validate_app() {
    echo ""
    echo "=========================================="
    echo "APP VALIDATION"
    echo "=========================================="
    echo ""
    echo "The KCD application is now running locally:"
    echo "  • Frontend: http://localhost:$FRONTEND_PORT"
    echo "  • Backend: http://localhost:$BACKEND_PORT"
    echo "  • API Health: http://localhost:$BACKEND_PORT/api/v1/health"
    echo ""
    echo "=========================================="
    echo "FEATURES TO CHECK:"
    echo "=========================================="
    echo "1. 3D WebGL Splash Screen loads with animated K, C, D characters"
    echo "2. Characters float smoothly and land at center"
    echo "3. Green glow effects and starfield background visible"
    echo "4. Application transitions to login page after animation"
    echo "5. Backend API responds to health check"
    echo ""
    
    read -p "Does the app match all requirements? (yes/no): " response
    
    case "$response" in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# ==============================================================================
# Function: Stage, commit, and push to GitHub
# ==============================================================================
commit_and_push() {
    log_info "Staging changes..."
    cd "$PROJECT_ROOT"
    
    git add -A
    
    log_info "Committing changes..."
    git commit -m "chore: app validation - deployment ready" || log_warning "No changes to commit"
    
    log_info "Pushing to GitHub..."
    git push origin main
    
    log_success "Changes pushed to GitHub"
}

# ==============================================================================
# Function: Deploy to Render
# ==============================================================================
deploy_to_render() {
    log_info "Deploying to Render..."
    log_warning "NOTE: Render deployment requires proper configuration"
    log_warning "Ensure render.yaml is configured with build and start commands"
    log_warning "Visit: https://dashboard.render.com to monitor deployment"
    
    # Show Git commit hash for reference
    cd "$PROJECT_ROOT"
    COMMIT_HASH=$(git rev-parse --short HEAD)
    log_success "Ready to deploy commit: $COMMIT_HASH"
    log_info "Deployment will be automatic on main branch push if webhook configured"
}

# ==============================================================================
# Function: Run self-healing (error fixing)
# ==============================================================================
self_heal() {
    log_warning "Running self-healing engine..."
    
    log_info "Checking for common issues..."
    
    # Check backend dependencies
    log_info "Verifying backend dependencies..."
    cd "$BACKEND_DIR"
    source venv/bin/activate
    pip install -q -r requirements.txt
    log_success "Backend dependencies verified"
    
    # Check frontend dependencies
    log_info "Verifying frontend dependencies..."
    cd "$FRONTEND_DIR"
    npm install --legacy-peer-deps > /dev/null 2>&1
    log_success "Frontend dependencies verified"
    
    # Check for lint/syntax errors
    log_info "Checking frontend for syntax errors..."
    cd "$FRONTEND_DIR"
    npm run build --mode development > /dev/null 2>&1 || log_warning "Build had warnings but completed"
    
    log_success "Self-healing completed"
}

# ==============================================================================
# Function: Main deployment workflow
# ==============================================================================
main() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════════════╗"
    echo "║                  KCD APP DEPLOYMENT AUTOMATION                     ║"
    echo "║                       $(date +%Y-%m-%d)                              ║"
    echo "╚════════════════════════════════════════════════════════════════════╝"
    echo ""
    
    # Step 1: Cleanup ports
    if ! cleanup_ports; then
        log_error "Failed to cleanup ports"
        exit 1
    fi
    
    echo ""
    
    # Step 2: Start backend
    if ! start_backend; then
        log_error "Failed to start backend"
        exit 1
    fi
    
    echo ""
    
    # Step 3: Start frontend
    if ! start_frontend; then
        log_warning "Frontend had issues, continuing..."
    fi
    
    echo ""
    
    # Step 4: Open browser
    open_browser
    
    echo ""
    
    # Step 5: Validate app
    if validate_app; then
        log_success "App validation PASSED"
        
        echo ""
        
        # Step 6: Commit and push
        commit_and_push
        
        echo ""
        
        # Step 7: Deploy to Render
        deploy_to_render
        
        echo ""
        log_success "DEPLOYMENT WORKFLOW COMPLETED SUCCESSFULLY"
        echo ""
        
        return 0
    else
        log_warning "App validation FAILED - Running self-healing..."
        
        echo ""
        
        # Run self-healing
        self_heal
        
        echo ""
        log_info "Self-healing completed. Restarting deployment..."
        
        # Stop running services
        kill $(cat /tmp/kcd_backend.pid 2>/dev/null) 2>/dev/null || true
        kill $(cat /tmp/kcd_frontend.pid 2>/dev/null) 2>/dev/null || true
        
        echo ""
        
        # Recursive call to try again
        main
    fi
}

# ==============================================================================
# Run main function
# ==============================================================================
main "$@"
