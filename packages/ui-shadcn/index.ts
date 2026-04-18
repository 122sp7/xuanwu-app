/**
 * @package ui-shadcn
 * shadcn/ui component library — public barrel export.
 *
 * All UI primitives are re-exported from this package.
 * Internal components use relative imports; external consumers use @ui-shadcn.
 */

// ─── Utility ──────────────────────────────────────────────────────────────────
export { cn } from "./lib/utils";

// ─── Hooks ────────────────────────────────────────────────────────────────────
export { useIsMobile } from "./hooks/use-mobile";

// ─── Provider ─────────────────────────────────────────────────────────────────
export { ThemeProvider } from "./provider/theme-provider";

// ─── Components ───────────────────────────────────────────────────────────────
export { Accordion } from "./ui/accordion";
export { AlertDialog } from "./ui/alert-dialog";
export { Alert } from "./ui/alert";
export { AspectRatio } from "./ui/aspect-ratio";
export { Avatar } from "./ui/avatar";
export { Badge } from "./ui/badge";
export { Breadcrumb } from "./ui/breadcrumb";
export { ButtonGroup } from "./ui/button-group";
export { Button } from "./ui/button";
export { Calendar } from "./ui/calendar";
export { Card } from "./ui/card";
export { Carousel } from "./ui/carousel";
export {  } from "./ui/chart";
export { Checkbox } from "./ui/checkbox";
export { Collapsible } from "./ui/collapsible";
export { Command } from "./ui/command";
export { ContextMenu } from "./ui/context-menu";
export { Dialog } from "./ui/dialog";
export {  } from "./ui/direction";
export { Drawer } from "./ui/drawer";
export { DropdownMenu } from "./ui/dropdown-menu";
export { Empty } from "./ui/empty";
export { Field } from "./ui/field";
export { HoverCard } from "./ui/hover-card";
export { InputGroup } from "./ui/input-group";
export { InputOTP } from "./ui/input-otp";
export { Input } from "./ui/input";
export { Item } from "./ui/item";
export { Kbd } from "./ui/kbd";
export { Label } from "./ui/label";
export { Menubar } from "./ui/menubar";
export { NavigationMenu } from "./ui/navigation-menu";
export { NativeSelect } from "./ui/native-select";
export { Pagination } from "./ui/pagination";
export { Popover } from "./ui/popover";
export { Progress } from "./ui/progress";
export { RadioGroup } from "./ui/radio-group";
export {  } from "./ui/resizable";
export { ScrollArea } from "./ui/scroll-area";
export { Select } from "./ui/select";
export { Separator } from "./ui/separator";
export { Sheet } from "./ui/sheet";
export { Sidebar } from "./ui/sidebar";
export { Skeleton } from "./ui/skeleton";
export { Slider } from "./ui/slider";
export {  } from "./ui/sonner";
export { Spinner } from "./ui/spinner";
export { Switch } from "./ui/switch";
export { Table } from "./ui/table";
export { Tabs } from "./ui/tabs";
export { Textarea } from "./ui/textarea";
export { ToggleGroup } from "./ui/toggle-group";
export { Toggle } from "./ui/toggle";
export { Tooltip } from "./ui/tooltip";
