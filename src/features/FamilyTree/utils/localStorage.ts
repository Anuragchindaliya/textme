const KEY = "family_tree_local";

export function saveLocal(tree: any) {
  localStorage.setItem(KEY, JSON.stringify(tree));
}

export function loadLocal() {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
}
