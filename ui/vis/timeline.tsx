"use client";

/**
 * @module ui/vis/timeline
 * React wrapper for vis-timeline.
 *
 * Provides a drop-in React component for interactive timeline visualization.
 */

import { useRef, useEffect, FC } from "react";
import { Timeline, DataSet } from "@/lib/vis";

export interface VisTimelineProps {
  /**
   * Timeline items (events)
   */
  items?: Array<{
    id: string | number;
    content: string;
    start: string | Date;
    end?: string | Date;
    [key: string]: unknown;
  }>;

  /**
   * Timeline groups (categories)
   */
  groups?: Array<{
    id: string | number;
    content: string;
    [key: string]: unknown;
  }>;

  /**
   * Timeline options
   */
  options?: Record<string, unknown>;

  /**
   * Fired when selection changes
   */
  onSelect?: (selection: (string | number)[]) => void;

  /**
   * Container CSS class
   */
  className?: string;

  /**
   * Container CSS styles
   */
  style?: React.CSSProperties;
}

/**
 * VisTimeline component - interactive timeline with React integration.
 *
 * @example
 * ```tsx
 * <VisTimeline
 *   items={[{ id: 1, content: "Event 1", start: new Date() }]}
 *   options={{ height: "100%" }}
 *   onSelect={(ids) => console.log("Selected:", ids)}
 * />
 * ```
 */
export const VisTimeline: FC<VisTimelineProps> = ({
  items = [],
  groups,
  options = { height: "400px" },
  onSelect,
  className,
  style = { width: "100%", height: "400px" },
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const timelineItems = new DataSet(items);
    const timelineGroups = groups ? new DataSet(groups) : new DataSet([]);

    const mergedOptions = {
      ...options,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const TimelineConstructor = Timeline as any;
    timelineRef.current = new TimelineConstructor(containerRef.current, timelineItems, timelineGroups, mergedOptions);

    if (onSelect) {
      const handleSelect = (event: { selection: (string | number)[] }) => {
        onSelect(event.selection);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timelineInstance = timelineRef.current as any;
      timelineInstance.on("select", handleSelect);

      return () => {
        if (timelineInstance) {
          timelineInstance.off("select", handleSelect);
          timelineInstance.destroy();
          timelineRef.current = null;
        }
      };
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const timelineInstance = timelineRef.current as any;
      if (timelineInstance) {
        timelineInstance.destroy();
        timelineRef.current = null;
      }
    };
  }, [items, groups, options, onSelect]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default VisTimeline;
