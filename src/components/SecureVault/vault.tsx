"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  content?: string | null;
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
  const [currentFolderId, setCurrentFolderId] = useState<string | number>(
    "root",
  );
  const [activeFilter, setActiveFilter] = useState<
    "all" | "favorites" | "trash"
  >("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | number | null>(null);
  const [modalConfig, setModalConfig] = useState<{
    show: boolean;
    type: "folder" | "file" | "rename";
    node?: VaultNode;
  }>({ show: false, type: "folder" });
  const [editingNode, setEditingNode] = useState<VaultNode | null>(null);
  const [editorContent, setEditorContent] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("vault_token");
    router.push("/accounts/login");
  };

  const handleApiError = useCallback(
    (error: unknown) => {
      const err = error as { response?: { status?: number } };
      console.error("Vault Error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("vault_token");
        router.push("/accounts/login");
      }
    },
    [router],
  );

  const fetchVaultData = useCallback(async () => {
    try {
      const res = await api.get("/v2/vault/nodes/");
      const results =
        res.data.results || (Array.isArray(res.data) ? res.data : []);

      setRootNode({
        id: "root",
        name: "my vault",
        type: "folder",
        children: results,
      });
    } catch (error) {
      handleApiError(error);
    }
  }, [handleApiError]);

  // --- Initial Fetch & Auth ---
  useEffect(() => {
    const token = localStorage.getItem("vault_token");
    if (!token) {
      router.push("/accounts/login");
    } else {
      fetchVaultData();
    }
  }, [router, fetchVaultData]);

  // --- Operations ---
  const patchNode = async (id: string | number, data: Partial<VaultNode>) => {
    try {
      await api.patch(`/v2/vault/nodes/${id}/`, data);
      await fetchVaultData();
      setActiveMenu(null);

      if (modalConfig.show && modalConfig.type === "rename") {
        setModalConfig({ ...modalConfig, show: false });
      }
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
      const res = await api.post("/v2/vault/nodes/", {
        name: finalName,
        type,
        parent: parentId,
        content: "",
      });
      fetchVaultData();
      setModalConfig({ ...modalConfig, show: false });

      // Auto-open if it's a file
      if (type === "file" && res.data) {
        setEditingNode(res.data);
        setEditorContent("");
      }
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

  const handleFileClick = (node: VaultNode) => {
    setEditingNode(node);
    setEditorContent(node.content || "");

    api
      .get(`/v2/vault/nodes/${node.id}/`)
      .then((res) => {
        setEditingNode((prev) => {
          if (prev && prev.id === node.id) {
            setEditorContent(res.data.content || "");
            return res.data;
          }
          return prev;
        });
      })
      .catch((error) => {
        console.error("Error fetching file content:", error);
      });
  };

  const closeEditor = () => {
    if (editingNode) {
      const nodeToSave = editingNode;
      const contentToSave = editorContent;

      setEditingNode(null);
      setEditorContent("");

      api
        .patch(`/v2/vault/nodes/${nodeToSave.id}/`, {
          content: contentToSave,
        })
        .then(() => {
          fetchVaultData();
        })
        .catch((error) => {
          console.error("Failed to save file", error);
        });
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

  const getAllNodes = (
    node: VaultNode,
    nodes: VaultNode[] = [],
  ): VaultNode[] => {
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
      if (
        activeMenu &&
        !(e.target as HTMLElement).closest(
          ".item-actions-menu, .item-actions-trigger",
        )
      ) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, [activeMenu]);

  return (
    <div className="app-container">
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar ${isSidebarOpen ? "open" : ""}`}
        onKeyDown={(e) => e.key === "Escape" && setIsSidebarOpen(false)}
      >
        <div
          className="logo"
          onClick={() => {
            setActiveFilter("all");
            setCurrentFolderId("root");
            setIsSidebarOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setActiveFilter("all");
              setCurrentFolderId("root");
              setIsSidebarOpen(false);
            }
          }}
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
              onClick={() => {
                setActiveFilter("all");
                setIsSidebarOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveFilter("all");
                  setIsSidebarOpen(false);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-hdd"></i> All Files
            </div>
            <div
              className={`nav-item ${activeFilter === "favorites" ? "active" : ""}`}
              onClick={() => {
                setActiveFilter("favorites");
                setIsSidebarOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setActiveFilter("favorites");
                  setIsSidebarOpen(false);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <i className="fas fa-star"></i> Favorites
            </div>
          </div>
        </nav>
        <div
          className="nav-item"
          onClick={handleLogout}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleLogout();
            }
          }}
          role="button"
          tabIndex={0}
          style={{ marginTop: "auto", color: "#ef4444" }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </div>
        <div className="storage-card" style={{ marginTop: "1rem" }}>
          <div className="storage-info">
            <span>Storage Used</span>
            <span>45%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "45%" }}></div>
          </div>
        </div>
      </aside>

      <main className="vault-main">
        <header className="top-bar">
          <div style={{ display: "flex", alignItems: "center" }}>
            <button
              className="menu-toggle"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div className="path-simple">
              {path.map((n, i) => (
                <React.Fragment key={n.id}>
                  {i < path.length - 1 ? (
                    <button
                      className="crumb"
                      onClick={() => setCurrentFolderId(n.id)}
                    >
                      {n.id === "root" ? (
                        <i className="fas fa-home"></i>
                      ) : (
                        n.name
                      )}
                    </button>
                  ) : (
                    <span className="current">
                      {n.id === "root" ? (
                        <i className="fas fa-home"></i>
                      ) : (
                        n.name
                      )}
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
              ? currentFolder.children || []
              : activeFilter === "favorites"
                ? getAllNodes(rootNode).filter(
                    (n) => n.is_favorite && !n.is_trashed,
                  )
                : getAllNodes(rootNode).filter((n) => n.is_trashed)
            ).map((node, index) => {
              const isFolder = node.type === "folder";
              return (
                <div
                  key={node.id ?? `node-${index}`}
                  className={`item ${isFolder ? "folder" : "file"}`}
                  onClick={() =>
                    isFolder
                      ? activeFilter === "all" && setCurrentFolderId(node.id)
                      : handleFileClick(node)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (isFolder && activeFilter === "all")
                        setCurrentFolderId(node.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {/* Action Trigger */}
                  <button
                    className="item-actions-trigger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === node.id ? null : node.id);
                    }}
                  >
                    <i className="fas fa-ellipsis-h"></i>
                  </button>

                  {/* Context Menu */}
                  {activeMenu === node.id && (
                    <div
                      className="item-actions-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {node.is_trashed ? (
                        <>
                          <button
                            onClick={() =>
                              patchNode(node.id, { is_trashed: false })
                            }
                          >
                            <i className="fas fa-undo"></i> Restore
                          </button>
                          <button
                            className="danger"
                            onClick={() => deletePermanently(node.id)}
                          >
                            <i className="fas fa-times"></i> Delete
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setModalConfig({
                                show: true,
                                type: "rename",
                                node,
                              });
                              setActiveMenu(null);
                            }}
                          >
                            <i className="fas fa-pencil-alt"></i> Rename
                          </button>
                          <button
                            onClick={() =>
                              patchNode(node.id, {
                                is_favorite: !node.is_favorite,
                              })
                            }
                          >
                            <i
                              className={`fas fa-star ${node.is_favorite ? "favorited" : ""}`}
                            ></i>
                            {node.is_favorite ? "Unstar" : "Favorite"}
                          </button>
                          <button
                            className="danger"
                            onClick={() =>
                              patchNode(node.id, { is_trashed: true })
                            }
                          >
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
                    {node.is_favorite && (
                      <i className="fas fa-star favorite-star"></i>
                    )}
                  </div>
                  <div className="meta">
                    <span>{isFolder ? "Folder" : node.ext || "File"}</span>
                    {isFolder && (
                      <span className="count">
                        {node.children?.length || 0}
                      </span>
                    )}
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
            <button
              className="btn"
              disabled={history.length === 0}
              onClick={() =>
                history.length > 0 &&
                setCurrentFolderId(history[history.length - 1].id)
              }
            >
              <i className="fas fa-chevron-left"></i> Back
            </button>
            <button
              className="btn"
              onClick={() => setModalConfig({ show: true, type: "file" })}
            >
              <i className="fas fa-file-medical"></i> New File
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setModalConfig({ show: true, type: "folder" })}
            >
              <i className="fas fa-folder-plus"></i> New Folder
            </button>
          </div>
        </footer>
      </main>

      {/* File Editor Overlay */}
      {editingNode && (
        <div className="modal" style={{ display: "flex" }}>
          <div
            className="modal-card"
            style={{
              width: "80%",
              height: "80%",
              maxWidth: "800px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <h3>{editingNode.name}</h3>
              <button
                onClick={closeEditor}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <textarea
              style={{
                flex: 1,
                width: "100%",
                resize: "none",
                padding: "10px",
                fontFamily: "monospace",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="Type here..."
            />
            <div className="modal-actions" style={{ marginTop: "10px" }}>
              <button
                className="modal-btn modal-btn-primary"
                onClick={closeEditor}
              >
                Close & Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {modalConfig.show && (
        <div
          className="modal"
          onClick={() => setModalConfig({ ...modalConfig, show: false })}
        >
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>
              {modalConfig.type === "rename"
                ? "Rename Item"
                : `Create ${modalConfig.type}`}
            </h3>
            <input
              className="modal-input"
              autoFocus
              defaultValue={modalConfig.node?.name || ""}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.currentTarget as HTMLInputElement).value;
                  if (modalConfig.type === "rename")
                    patchNode(modalConfig.node!.id, { name: val });
                  else createNode(val, modalConfig.type as "folder" | "file");
                }
              }}
            />
            <div className="modal-actions">
              <button
                className="modal-btn"
                onClick={() => setModalConfig({ ...modalConfig, show: false })}
              >
                Cancel
              </button>
              <button
                className="modal-btn modal-btn-primary"
                onClick={(e) => {
                  const input = e.currentTarget.parentElement
                    ?.previousElementSibling as HTMLInputElement;
                  const val = input.value;
                  if (modalConfig.type === "rename")
                    patchNode(modalConfig.node!.id, { name: val });
                  else createNode(val, modalConfig.type as "folder" | "file");
                }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
