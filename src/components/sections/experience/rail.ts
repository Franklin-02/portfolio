/**
 * Scroll behaviour of the timeline rail.
 *
 * The rail is drawn down to one fixed height of the viewport, 60% from the top:
 * while the visitor scrolls, the end of the line stays at that height and the
 * timeline moves through it. A node lights up when it crosses the same height.
 */

/** Each stretch of rail fills from the moment its top reaches the draw line until its bottom does. */
export const SEGMENT_OFFSET: ['start 0.6', 'end 0.6'] = ['start 0.6', 'end 0.6']

/**
 * Observer margin for a node: everything above the draw line counts as reached
 * (the large top margin keeps a node lit after it has left the top of the screen).
 */
export const NODE_REACHED_MARGIN = '100000px 0px -40% 0px'
