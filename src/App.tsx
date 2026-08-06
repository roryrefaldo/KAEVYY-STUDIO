import React, { useState, lazy, Suspense } from 'react';
import { Header, WorkspaceMode } from './components/Header';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthModal } from './components/auth/AuthModal';
import { DeveloperPendingVerification } from './components/auth/DeveloperPendingVerification';
import { AccountSuspended } from './components/auth/AccountSuspended';
import { UnauthorizedAccess } from './components/auth/UnauthorizedAccess';
import { sampleShareAssets } from './data/shareAssetsData';
import { OrderItem } from './types/prd';

// Lazy loaded workspace route chunks for optimal production bundle splitting
const PublicHome = lazy(() => import('./components/PublicHome').then(m => ({ default: m.PublicHome })));
const ClientPortal = lazy(() => import('./components/ClientPortal').then(m => ({ default: m.ClientPortal })));
const DeveloperWorkspace = lazy(() => import('./components/DeveloperWorkspace').then(m => ({ default: m.DeveloperWorkspace })));
const AdminConsole = lazy(() => import('./components/AdminConsole').then(m => ({ default: m.AdminConsole })));
const ShareAssetLibrary = lazy(() => import('./components/ShareAssetLibrary').then(m => ({ default: m.ShareAssetLibrary })));
const AssetDetailPage = lazy(() => import('./components/AssetDetailPage').then(m => ({ default: m.AssetDetailPage })));
const UploadAssetPage = lazy(() => import('./components/UploadAssetPage').then(m => ({ default: m.UploadAssetPage })));
const OrderDetailModal = lazy(() => import('./components/OrderDetailModal').then(m => ({ default: m.OrderDetailModal })));

function RouteLoadingFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-4">
      <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
      <span className="text-xs font-mono text-slate-400 animate-pulse">Memuat workspace KAEVY Studio...</span>
    </div>
  );
}

function AppContent() {
  const { user, isAuthenticated, role, status, permissions } = useAuth();
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('public');

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'login' | 'register'>('login');
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'CLIENT' | 'DEVELOPER'>('CLIENT');

  // Share Asset Sub-routing State
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isUploadingAsset, setIsUploadingAsset] = useState<boolean>(false);

  // Active Order Detail Modal State
  const [selectedOrderModal, setSelectedOrderModal] = useState<OrderItem | null>(null);

  const selectedAsset = sampleShareAssets.find(a => a.id === selectedAssetId);

  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login', role: 'CLIENT' | 'DEVELOPER' = 'CLIENT') => {
    setAuthModalInitialMode(mode);
    setAuthModalInitialRole(role);
    setIsAuthModalOpen(true);
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsUploadingAsset(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenUploadAsset = () => {
    if (!isAuthenticated) {
      handleOpenAuthModal('login');
      return;
    }
    setWorkspaceMode('share-assets');
    setIsUploadingAsset(true);
    setSelectedAssetId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper for mode switching with permissions check
  const handleSelectWorkspaceMode = (mode: WorkspaceMode) => {
    setSelectedAssetId(null);
    setIsUploadingAsset(false);

    if (mode === 'client') {
      if (!isAuthenticated) {
        setWorkspaceMode('client'); // Will render UnauthorizedAccess or open AuthModal
        return;
      }
    } else if (mode === 'developer') {
      if (!isAuthenticated) {
        setWorkspaceMode('developer'); // Will render UnauthorizedAccess or open AuthModal
        return;
      }
    } else if (mode === 'admin') {
      if (role !== 'ADMIN') {
        setWorkspaceMode('admin'); // Will render UnauthorizedAccess
        return;
      }
    }

    setWorkspaceMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Platform Top Header & Workspace Switcher */}
      <Header
        currentMode={workspaceMode}
        onSelectMode={handleSelectWorkspaceMode}
        onOpenUploadAsset={handleOpenUploadAsset}
        onOpenAuthModal={handleOpenAuthModal}
      />

      {/* Dynamic Workspace View Container with RBAC Route Protection */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Account Suspended Guard */}
        {isAuthenticated && status === 'SUSPENDED' && workspaceMode !== 'public' && workspaceMode !== 'share-assets' ? (
          <AccountSuspended onBackHome={() => setWorkspaceMode('public')} />
        ) : (
          <Suspense fallback={<RouteLoadingFallback />}>
            {/* 1. PUBLIC HOMEPAGE */}
            {workspaceMode === 'public' && (
              <PublicHome
                onNavigate={handleSelectWorkspaceMode}
                onSelectAsset={(assetId) => {
                  setWorkspaceMode('share-assets');
                  handleSelectAsset(assetId);
                }}
              />
            )}

            {/* 2. CLIENT PORTAL */}
            {workspaceMode === 'client' && (
              !isAuthenticated ? (
                <UnauthorizedAccess
                  requiredRole="CLIENT"
                  onOpenLogin={() => handleOpenAuthModal('login', 'CLIENT')}
                  onBackHome={() => setWorkspaceMode('public')}
                />
              ) : role !== 'CLIENT' && role !== 'ADMIN' ? (
                <UnauthorizedAccess
                  requiredRole="CLIENT"
                  onOpenLogin={() => handleOpenAuthModal('login', 'CLIENT')}
                  onBackHome={() => setWorkspaceMode('public')}
                />
              ) : (
                <ClientPortal
                  onNavigate={handleSelectWorkspaceMode}
                  onOpenOrderModal={(order) => setSelectedOrderModal(order)}
                  onOpenShareAssets={() => {
                    setWorkspaceMode('share-assets');
                    setSelectedAssetId(null);
                    setIsUploadingAsset(false);
                  }}
                />
              )
            )}

            {/* 3. DEVELOPER WORKSPACE */}
            {workspaceMode === 'developer' && (
              !isAuthenticated ? (
                <UnauthorizedAccess
                  requiredRole="DEVELOPER"
                  onOpenLogin={() => handleOpenAuthModal('login', 'DEVELOPER')}
                  onBackHome={() => setWorkspaceMode('public')}
                />
              ) : role !== 'DEVELOPER' && role !== 'ADMIN' ? (
                <UnauthorizedAccess
                  requiredRole="DEVELOPER"
                  onOpenLogin={() => handleOpenAuthModal('login', 'DEVELOPER')}
                  onBackHome={() => setWorkspaceMode('public')}
                />
              ) : role === 'DEVELOPER' && (status === 'PENDING_VERIFICATION' || user?.developerProfile?.verificationStatus === 'PENDING') ? (
                <DeveloperPendingVerification onBackHome={() => setWorkspaceMode('public')} />
              ) : (
                <DeveloperWorkspace
                  onNavigate={handleSelectWorkspaceMode}
                  onOpenOrderModal={(order) => setSelectedOrderModal(order)}
                  onOpenUploadAsset={handleOpenUploadAsset}
                />
              )
            )}

            {/* 4. ADMIN CONSOLE */}
            {workspaceMode === 'admin' && (
              role !== 'ADMIN' ? (
                <UnauthorizedAccess
                  requiredRole="ADMIN"
                  onOpenLogin={() => handleOpenAuthModal('login')}
                  onBackHome={() => setWorkspaceMode('public')}
                />
              ) : (
                <AdminConsole
                  onNavigate={handleSelectWorkspaceMode}
                  onOpenOrderModal={(order) => setSelectedOrderModal(order)}
                  onOpenAssetDetail={(assetId) => {
                    setWorkspaceMode('share-assets');
                    handleSelectAsset(assetId);
                  }}
                />
              )
            )}

            {/* 5. SHARE ASSET LIBRARY & SUB-PAGES */}
            {workspaceMode === 'share-assets' && (
              <>
                {isUploadingAsset ? (
                  <UploadAssetPage
                    onBack={() => setIsUploadingAsset(false)}
                    onSuccess={() => {
                      setIsUploadingAsset(false);
                      setSelectedAssetId(null);
                    }}
                  />
                ) : selectedAsset ? (
                  <AssetDetailPage
                    asset={selectedAsset}
                    onBack={() => setSelectedAssetId(null)}
                  />
                ) : (
                  <ShareAssetLibrary
                    onSelectAsset={handleSelectAsset}
                    onOpenUploadAsset={handleOpenUploadAsset}
                  />
                )}
              </>
            )}
          </Suspense>
        )}

      </main>

      {/* Shared Interactive Order Detail Modal */}
      {selectedOrderModal && (
        <Suspense fallback={null}>
          <OrderDetailModal
            order={selectedOrderModal}
            onClose={() => setSelectedOrderModal(null)}
          />
        </Suspense>
      )}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalInitialMode}
        initialRole={authModalInitialRole}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

