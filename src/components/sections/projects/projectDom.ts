/** DOM id of a project card's title. */
export function projectTitleId(slug: string): string {
  return `project-${slug}-title`
}

/** DOM id of a project card's "View Details" button: focus returns to it when the detail view closes. */
export function projectTriggerId(slug: string): string {
  return `project-${slug}-details`
}
