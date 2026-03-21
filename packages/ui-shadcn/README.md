# ui-shadcn

## Purpose

shadcn/ui component library package. Provides the single import path for all shadcn-based UI primitives used throughout the application. This is the canonical source for buttons, dialogs, forms, tables, and all other base UI building blocks.

## Belongs to Module

UI layer — used by all interface layers, app routes, and module components.

## Public API

### Layout & Structure
`Accordion`, `AspectRatio`, `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Collapsible`, `Separator`, `Sidebar`, `Tabs`, `ScrollArea`

### Feedback & Overlays
`Alert`, `AlertDialog`, `Dialog`, `Drawer`, `HoverCard`, `Popover`, `Sheet`, `Tooltip`, `Sonner`

### Navigation
`Breadcrumb`, `DropdownMenu`, `Menubar`, `NavigationMenu`, `Pagination`, `ContextMenu`, `Command`

### Forms & Inputs
`Button`, `Calendar`, `Checkbox`, `Input`, `InputGroup`, `InputOTP`, `Label`, `RadioGroup`, `Select`, `Slider`, `Switch`, `Textarea`, `Toggle`, `ToggleGroup`

### Display
`Avatar`, `Badge`, `Carousel`, `Chart`, `Kbd`, `Progress`, `Skeleton`, `Spinner`, `Table`

### Hooks
`useMobile`, `useToast`

## Dependencies

- Radix UI primitives (`@radix-ui/*`)
- `class-variance-authority`
- `clsx` + `tailwind-merge` (via `@/libs/utils`)
- Tailwind CSS

## Example

```typescript
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui-shadcn";

function MyModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>My Dialog</DialogTitle>
        </DialogHeader>
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
```

## Rules

- Do not import `@/ui/shadcn/ui/*` directly — always use `@ui-shadcn`
- Do not add business logic to this package — keep it pure UI primitives
- All components are composable Radix-based primitives; extend via `className` and CVA variants
