"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// ---------- Types ----------
interface VaultNode {
  id: string | number;
  name: string;
  type: "folder" | "file";
  ext?: string;
  size?: string;
  children?: VaultNode[];
  parent?: number | null;
  is_favorite?: boolean;
  is_trashed?: boolean;
}

export default function Vault() {
  const router = useRouter();

  // --- State ---
  const [rootNode, setRootNode] = useState<VaultNode>({
    id: "root",
    name: "my vault",
    type: "folder",
    children: [],
  });
  const [currentFolderId, setCurrentFolderId] = useState<string | number>("root");
  const [activeFilter, setActiveFilter] = useState<"all" | "favorites" | "trash">("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | number | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    type: "folder" | "file" | "rename";
    node?: VaultNode;
  }>({ show: false, type: "folder" });

  // --- Initial Fetch & Auth ---
  useEffect(() => {
    const token = localStorage.getItem("vault_token");
    if (!token) {
      router.push("/accounts/login");
    } else {
      fetchVaultData();
    }
  }, [router]);

  const handleApiError = (error: any) => {
    console.error("Vault Error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("vault_token");
      router.push("/accounts/login");
    }
  };

  const fetchVaultData = async () => {
    try {
      const res = await api.get("/v2/vault/nodes/");
      const nodes = (Array.isArray(res.data) ? res.data : res.data?.results || []) as VaultNode[];
      const root: VaultNode = { id: "root", name: "my vault", type: "folder", children: [] };
      const nodeMap = new Map<string | number, VaultNode>();

      nodes.forEach((n) => nodeMap.set(n.id, { ...n, children: [] }));
      nodes.forEach((n) => {
        const node = nodeMap.get(n.id)!;
        if (n.parent === null || n.parent === 0) {
          root.children?.push(node);
        } else {
          const parent = nodeMap.get(n.parent);
          if (parent) parent.children?.push(node);
          else root.children?.push(node);
        }
      });
      setRootNode(root);
    } catch (error) {
      handleApiError(error);
    }
  };

  // --- Operations ---
  const patchNode = async (id: number, data: Partial<VaultNode>) => {
    try {
      await api.patch(`/v2/vault/nodes/${id}/`, data);
      await fetchVaultData();
      setActiveMenu(null);
    } catch (error) {
      handleApiError(error);
    }
  };

  const createNode = async (name: string, type: "folder" | "file") => {
    if (!name.trim()) return;
    try {
      const parentId = currentFolderId === "root" ? 0 : Number(currentFolderId);
      let finalName = name.trim();
      if (type === "file" && !finalName.includes(".")) finalName += ".txt";
      await api.post("/v2/vault/nodes/", { name: finalName, type, parent: parentId });
      fetchVaultData();
      setModalConfig({ ...modalConfig, show: false });
    } catch (error) {
      handleApiError(error);
    }
  };

  const deletePermanently = async (nodeId: string | number) => {
    if (window.confirm("Permanent delete? This cannot be undone.")) {
      try {
        await api.delete(`/v2/vault/nodes/${nodeId}/`);
        fetchVaultData();
        setActiveMenu(null);
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  // --- Helpers ---
  const getPath = (node: VaultNode, targetId: string | number): VaultNode[] => {
    if (node.id === targetId) return [node];
    if (node.children) {
      for (const child of node.children) {
        const p = getPath(child, targetId);
        if (p.length > 0) return [node, ...p];
      }
    }
    return [];
  };

  const getAllNodes = (node: VaultNode, nodes: VaultNode[] = []): VaultNode[] => {
    if (node.children) {
      for (const child of node.children) {
        nodes.push(child);
        getAllNodes(child, nodes);
      }
    }
    return nodes;
  };

  const path = getPath(rootNode, currentFolderId);
  const currentFolder = path.length > 0 ? path[path.length - 1] : rootNode;
  const history = path.slice(0, -1);

  const getIcon = (ext?: string, isFolder?: boolean) => {
    if (isFolder) return "fa-folder";
    const icons: Record<string, string> = {
      pdf: "fa-file-pdf",
      docx: "fa-file-word",
      txt: "fa-file-alt",
    };
    return icons[ext || ""] || "fa-file";
  };

  // Handle outside click for menu
  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (activeMenu && !(e.target as HTMLElement).closest(".item-actions-menu, .item-actions-trigger")) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [activeMenu]);

  return (
    <div className="app-container">
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`} onKeyDown={(e) => e.key === 'Escape' && setIsSidebarOpen(false)}>
        <div 
          className="logo" 
          onClick={() => { setActiveFilter("all"); setCurrentFolderId("root"); setIsSidebarOpen(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveFilter("all"); setCurrentFolderId("root"); setIsSidebarOpen(false); } }}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-shield-alt"></i> <span>VAULT</span>
        </div>
        <nav className="side-nav">
          <div className="nav-group">
            <label>Library</label>
            <div 
              className={`nav-item ${activeFilter === "all" ? "active" : ""}`} 
              onClick={() => { setActiveFilter("all"); setIsSidebarOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveFilter("all"); setIsSidebarOpen(false); } }}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-hdd"></i> All Files
            </div>
            <div 
              className={`nav-item ${activeFilter === "favorites" ? "active" : ""}`} 
              onClick={() => { setActiveFilter("favorites"); setIsSidebarOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveFilter("favorites"); setIsSidebarOpen(false); } }}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-star"></i> Favorites
            </div>
            <div 
              className={`nav-item ${activeFilter === "trash" ? "active" : ""}`} 
              onClick={() => { setActiveFilter("trash"); setIsSidebarOpen(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActiveFilter("trash"); setIsSidebarOpen(false); } }}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-trash-alt"></i> Trash
            </div>
          </div>
        </nav>
        <div className="storage-card">
          <div className="storage-info">
            <span>Storage Used</span>
            <span>45%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '45%' }}></div>
          </div>
        </div>
      </aside>

      <main className="vault-main">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="menu-toggle" onClick={() => setIsSidebarOpen(true)}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="path-simple">
              {path.map((n, i) => (
                <React.Fragment key={n.id}>
                  {i < path.length - 1 ? (
                    <button className="crumb" onClick={() => setCurrentFolderId(n.id)}>
                      {n.id === "root" ? <i className="fas fa-home"></i> : n.name}
                    </button>
                  ) : (
                    <span className="current">
                      {n.id === "root" ? <i className="fas fa-home"></i> : n.name}
                    </span>
                  )}
                  {i < path.length - 1 && <span className="sep">/</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="trust">
            <i className="fas fa-lock"></i> AES-256 Protected
          </div>
        </header>

        <section className="scroll-area">
          <div className="grid">
            {(activeFilter === "all" 
                ? (currentFolder.children || []) 
                : activeFilter === "favorites" 
                ? getAllNodes(rootNode).filter(n => n.is_favorite && !n.is_trashed)
                : getAllNodes(rootNode).filter(n => n.is_trashed)
            ).map((node) => {
              const isFolder = node.type === "folder";
              return (
                <div
                  key={node.id}
                  className={`item ${isFolder ? "folder" : "file"}`}
                  onClick={() => isFolder && activeFilter === "all" && setCurrentFolderId(node.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (isFolder && activeFilter === 'all') setCurrentFolderId(node.id); } }}
                  role="button"
                  tabIndex={0}
                >
                  
                  {/* Action Trigger */}
                  <button className="item-actions-trigger" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === node.id ? null : node.id); }}>
                    <i className="fas fa-ellipsis-h"></i>
                  </button>

                  {/* Context Menu */}
                  {activeMenu === node.id && (
                    <div className="item-actions-menu" onClick={(e) => e.stopPropagation()}>
                      {node.is_trashed ? (
                        <>
                          <button onClick={() => patchNode(Number(node.id), { is_trashed: false })}>
                            <i className="fas fa-undo"></i> Restore
                          </button>
                          <button className="danger" onClick={() => deletePermanently(node.id)}>
                            <i className="fas fa-times"></i> Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => { setModalConfig({ show: true, type: "rename", node }); setActiveMenu(null); }}>
                            <i className="fas fa-pencil-alt"></i> Rename
                          </button>
                          <button onClick={() => patchNode(Number(node.id), { is_favorite: !node.is_favorite })}>
                            <i className={`fas fa-star ${node.is_favorite ? 'favorited' : ''}`}></i> 
                            {node.is_favorite ? "Unstar" : "Favorite"}
                          </button>
                          <button className="danger" onClick={() => patchNode(Number(node.id), { is_trashed: true })}>
                            <i className="fas fa-trash-alt"></i> Trash
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <div className="icon">
                    <i className={`fas ${getIcon(node.ext, isFolder)}`}></i>
                  </div>
                  <div className="name">
                    {node.name}
                    {node.is_favorite && <i className="fas fa-star favorite-star"></i>}
                  </div>
                  <div className="meta">
                    <span>{isFolder ? "Folder" : (node.ext || "File")}</span>
                    {isFolder && <span className="count">{node.children?.length || 0}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <footer className="footer-actions">
          <div className="signature">
            <i className="fas fa-check-double"></i> Cloud Sync Ready
          </div>
          <div className="action-buttons">
            <button className="btn" disabled={history.length === 0} onClick={() => history.length > 0 && setCurrentFolderId(history[history.length - 1].id)}>
              <i className="fas fa-chevron-left"></i> Back
            </button>
            <button className="btn" onClick={() => setModalConfig({ show: true, type: "file" })}>
              <i className="fas fa-file-medical"></i> New File
            </button>
            <button className="btn btn-primary" onClick={() => setModalConfig({ show: true, type: "folder" })}>
              <i className="fas fa-folder-plus"></i> New Folder
            </button>
          </div>
        </footer>
      </main>

      {/* Modal Overlay */}
      {modalConfig.show && (
        <div className="modal" onClick={() => setModalConfig({ ...modalConfig, show: false })}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{modalConfig.type === "rename" ? "Rename Item" : `Create ${modalConfig.type}`}</h3>
            <input 
              className="modal-input" 
              autoFocus 
              defaultValue={modalConfig.node?.name || ""} 
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  const val = (e.currentTarget as HTMLInputElement).value;
                  if (modalConfig.type === "rename") patchNode(Number(modalConfig.node?.id), { name: val });
                  else createNode(val, modalConfig.type as "folder" | "file");
                }
              }}
            />
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setModalConfig({ ...modalConfig, show: false })}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={(e) => {
                const input = e.currentTarget.parentElement?.previousElementSibling as HTMLInputElement;
                const val = input.value;
                if (modalConfig.type === "rename") patchNode(Number(modalConfig.node?.id), { name: val });
                else createNode(val, modalConfig.type as "folder" | "file");
              }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}