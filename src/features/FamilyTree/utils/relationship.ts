import { FamilyNode } from "../type"

export function autoRelation(node: FamilyNode, allNodes: FamilyNode[]) {
  if (
    !node.parentIds.length &&
    !node.childIds.length &&
    !node.partnerIds.length
  ) {
    return "Relative"
  }

  if (node.parentIds.length === 0 && node.childIds.length > 0) {
    return "Parent"
  }

  if (node.childIds.length === 0 && node.parentIds.length > 0) {
    return "Child"
  }

  if (node.partnerIds.length > 0) {
    return "Partner"
  }

  // Siblings: same parents
  const siblings = allNodes.filter(
    (other) =>
      other.id !== node.id &&
      other.parentIds.some((p) => node.parentIds.includes(p)),
  )
  if (siblings.length) return "Sibling"

  return "Relative"
}
