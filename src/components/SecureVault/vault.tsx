"use client";

import React, { useState, useRef, useEffect } from "react";

// ---------- types ----------
interface VaultNode {
  id: string;
  name: string;
  type: "folder" | "file";
  ext?: string;
  size?: string;
  children?: VaultNode[];
}

// ---------- component ----------
export default function Vault() {
  // ---------- initial data & state ----------
  const initialRoot: VaultNode = {
    id: "root",
    name: "my vault",
    type: "folder",
    children: [
      {
        id: "c1",
        name: "Baker LLP",
        type: "folder",
        children: [
          {
            id: "f1",
            name: "merger.pdf",
            type: "file",
            ext: "pdf",
            size: "1.4",
          },
        ],
      },
      {
        id: "c2",
        name: "First Credit",
        type: "folder",
        children: [
          { id: "f2", name: "SOC2.pdf", type: "file", ext: "pdf", size: "2.2" },
        ],
      },
      { id: "c3", name: "policies", type: "folder", children: [] },
      { id: "x1", name: "budget.xlsx", type: "file", ext: "xlsx", size: "0.9" },
    ],
  };

  const [currentFolder, setCurrentFolder] = useState<VaultNode>(initialRoot);
  const [history, setHistory] = useState<VaultNode[]>([]);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  const folderNameInput = useRef<HTMLInputElement>(null);
  const fileNameInput = useRef<HTMLInputElement>(null);
  const rootRef = useRef<VaultNode>(initialRoot);

  // ---------- helpers ----------
  const genId = () => "n" + Date.now() + Math.random().toString(36).substring(2, 6);

  const getIcon = (ext?: string, isFolder?: boolean) => {
    if (isFolder) return "fa-folder";
    if (ext === "pdf") return "fa-file-pdf";
    if (ext === "docx") return "fa-file-word";
    if (ext === "xlsx") return "fa-file-excel";
    if (ext === "txt") return "fa-file-alt";
    return "fa-file";
  };

  // ---------- navigation ----------
  const openFolder = (folder: VaultNode) => {
    if (folder.type !== "folder") return;
    setHistory((prev) => [...prev, currentFolder]);
    setCurrentFolder(folder);
  };

  const goBack = () => {
    if (history.length === 0) return;
    const prevHistory = [...history];
    const prevFolder = prevHistory.pop()!;
    setHistory(prevHistory);
    setCurrentFolder(prevFolder);
  };

  const resetToRoot = () => {
    setHistory([]);
    setCurrentFolder(rootRef.current);
  };

  // ---------- create folder / file ----------
  const createFolderInCurrent = (name: string) => {
    if (!name.trim()) return;
    const newFolder: VaultNode = {
      id: genId(),
      name: name.trim(),
      type: "folder",
      children: [],
    };
    setCurrentFolder((prev) => ({
      ...prev,
      children: [...(prev.children || []), newFolder],
    }));
  };

  const createFileInCurrent = (name: string) => {
    if (!name.trim()) return;
    let fileName = name.trim();
    let ext = fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() : "txt";
    if (!fileName.includes(".")) fileName += ".txt";

    const newFile: VaultNode = {
      id: genId(),
      name: fileName,
      type: "file",
      ext,
      size: (Math.random() * 5).toFixed(1),
    };
    setCurrentFolder((prev) => ({
      ...prev,
      children: [...(prev.children || []), newFile],
    }));
  };

  // ---------- breadcrumb logic ----------
  const findNodeById = (node: VaultNode, id: string): VaultNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        if (child.type === "folder") {
          const found = findNodeById(child, id);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const navigateToBreadcrumb = (folderId: string) => {
    const target = findNodeById(rootRef.current, folderId);
    if (!target || target.type !== "folder") return;

    const buildPath = (node: VaultNode, id: string, acc: VaultNode[] = []): VaultNode[] | null => {
      if (node.id === id) return acc;
      if (node.children) {
        for (const child of node.children) {
          if (child.type === "folder") {
            const result = buildPath(child, id, [...acc, node]);
            if (result) return result;
          }
        }
      }
      return null;
    };

    const path = buildPath(rootRef.current, target.id, []);
    if (path) {
      setHistory(path.filter((f) => f.id !== "root"));
      setCurrentFolder(target);
    }
  };

  // ---------- render helpers ----------
  const renderBreadcrumb = () => {
    const path = [rootRef.current, ...history, currentFolder];
    const unique = path.filter((v, i, a) => a.findIndex((p) => p.id === v.id) === i);

    return (
      <div className="path-simple">
        {unique.map((node, idx) => (
          <React.Fragment key={node.id}>
            {idx > 0 && <span className="sep">/</span>}
            {idx === unique.length - 1 ? (
              <span className="current">
                <i className="fas fa-folder-open"></i> {node.id === "root" ? "vault" : node.name}
              </span>
            ) : (
              <span className="crumb" onClick={() => navigateToBreadcrumb(node.id)}>
                {node.id === "root" ? <i className="fas fa-home"></i> : <i className="fas fa-folder"></i>}
                {node.id === "root" ? "vault" : node.name}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderGrid = () => {
    if (!currentFolder.children || currentFolder.children.length === 0) {
      return (
        <div className="empty-message">
          <i className="fas fa-cloud-upload-alt" style={{ fontSize: "3rem", marginBottom: "16px", display: "block" }}></i>
          <h3>This folder is empty</h3>
          <p>Drag files here or use the "New" buttons below</p>
        </div>
      );
    }

    const sorted = [...currentFolder.children].sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

    return (
      <div className="grid">
        {sorted.map((node) => {
          const isFolder = node.type === "folder";
          const iconName = getIcon(node.ext, isFolder);
          return (
            <div
              key={node.id}
              className={`item ${isFolder ? "folder" : "file"}`}
              onClick={() => (isFolder ? openFolder(node) : alert(`Preview: ${node.name}`))}
            >
              <div className="icon">
                <i className={`fas ${iconName}`}></i>
              </div>
              <div className="name">{node.name}</div>
              <div className="meta">
                <span>{isFolder ? "Folder" : `${node.size} KB`}</span>
                {isFolder && node.children && <span className="count">{node.children.length}</span>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    if (showFolderModal) folderNameInput.current?.focus();
    if (showFileModal) fileNameInput.current?.focus();
  }, [showFolderModal, showFileModal]);

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo" onClick={resetToRoot}>
          <i className="fas fa-lock"></i>
          <span>vault</span>
        </div>

        <nav className="side-nav">
          <div className="nav-group">
            <label>Menu</label>
            <div className={`nav-item ${currentFolder.id === 'root' ? 'active' : ''}`} onClick={resetToRoot}>
              <i className="fas fa-th-large"></i> All Files
            </div>
            <div className="nav-item">
              <i className="fas fa-clock"></i> Recent
            </div>
            <div className="nav-item">
              <i className="fas fa-star"></i> Favorites
            </div>
            <div className="nav-item">
              <i className="fas fa-trash"></i> Trash
            </div>
          </div>
        </nav>

        <div className="storage-card">
          <div className="storage-info">
            <span>Storage</span>
            <span>42% used</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "42%" }}></div>
          </div>
        </div>
      </aside>

      {/* MAIN VIEW */}
      <main className="vault-main">
        <header className="top-bar">
          {renderBreadcrumb()}
          <div className="trust">
            <i className="fas fa-shield-check"></i> client‑side encryption
          </div>
        </header>

        <section className="scroll-area">
          {renderGrid()}
        </section>

        <footer className="footer-actions">
          <div className="action-buttons">
            <button className="btn btn-primary" onClick={() => setShowFolderModal(true)}>
              <i className="fas fa-folder-plus"></i> New Folder
            </button>
            <button className="btn" onClick={() => setShowFileModal(true)}>
              <i className="fas fa-file-medical"></i> New File
            </button>
            <button className="btn" onClick={goBack} disabled={history.length === 0}>
              <i className="fas fa-chevron-left"></i> Back
            </button>
          </div>
          <span className="signature">
            <i className="fas fa-fingerprint"></i> End-to-end encrypted
          </span>
        </footer>
      </main>

      {/* MODALS */}
      {showFolderModal && (
        <div className="modal" onClick={() => setShowFolderModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>New Folder</h3>
            <input
              ref={folderNameInput}
              type="text"
              className="modal-input"
              placeholder="Enter folder name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createFolderInCurrent(e.currentTarget.value);
                  setShowFolderModal(false);
                }
              }}
            />
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setShowFolderModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={() => {
                createFolderInCurrent(folderNameInput.current?.value || "");
                setShowFolderModal(false);
              }}>Create</button>
            </div>
          </div>
        </div>
      )}

      {showFileModal && (
        <div className="modal" onClick={() => setShowFileModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>New File</h3>
            <input
              ref={fileNameInput}
              type="text"
              className="modal-input"
              placeholder="e.g. document.txt"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  createFileInCurrent(e.currentTarget.value);
                  setShowFileModal(false);
                }
              }}
            />
            <div className="modal-actions">
              <button className="modal-btn" onClick={() => setShowFileModal(false)}>Cancel</button>
              <button className="modal-btn modal-btn-primary" onClick={() => {
                createFileInCurrent(fileNameInput.current?.value || "");
                setShowFileModal(false);
              }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}