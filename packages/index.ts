/**
 * @module packages
 * Unique entry point for all package-layer public surfaces.
 *
 * Import everything from this barrel:
 *   import { generateId, Button, firestoreApi } from '@packages'
 *
 * All named exports are explicit — no wildcard re-exports.
 */

// ─── infra/client-state ───────────────────────────────────────────────────────
export {
  updateClientState,
  cloneClientState,
  type ClientStateUpdater,
} from "./infra/client-state";

// ─── infra/http ───────────────────────────────────────────────────────────────
export {
  request,
  requestJson,
  HttpError,
  type HttpRequestOptions,
} from "./infra/http";

// ─── infra/serialization ──────────────────────────────────────────────────────
export {
  safeJsonParse,
  toJsonString,
  encodeBase64,
  decodeBase64,
  superJsonStringify,
  superJsonParse,
  superJsonSerialize,
  superJsonDeserialize,
  SuperJSON,
  type JsonParseResult,
} from "./infra/serialization";

// ─── infra/state ──────────────────────────────────────────────────────────────
export {
  create,
  createStore,
  replaceStoreState,
  createMachine,
  createActor,
  assign,
  setup,
  useMachine,
  useActorRef,
  useSelector,
  shallowEqual,
  createActorContext,
  type StoreApi,
  type StateCreator,
  type ActorRefFrom,
  type SnapshotFrom,
} from "./infra/state";

// ─── infra/query ──────────────────────────────────────────────────────────────
export {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useInfiniteQuery,
  useSuspenseQuery,
  useQueryClient,
  queryOptions,
  infiniteQueryOptions,
  type QueryClientConfig,
  type UseQueryOptions,
  type UseMutationOptions,
  type UseInfiniteQueryOptions,
  type QueryKey,
  type QueryFunction,
  type MutationFunction,
  type DefaultError,
  type InfiniteData,
  type QueryObserverResult,
  type MutationObserverResult,
} from "./infra/query";

// ─── infra/date ───────────────────────────────────────────────────────────────
export {
  format,
  parse,
  parseISO,
  formatISO,
  formatDistanceToNow,
  formatDistance,
  formatRelative,
  isValid,
  isDate,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  addHours,
  subHours,
  addMinutes,
  subMinutes,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  isEqual,
  compareAsc,
  compareDesc,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  getYear,
  getMonth,
  getDate,
  getDay,
  getHours,
  getMinutes,
  getSeconds,
  setYear,
  setMonth,
  setDate,
  setHours,
  setMinutes,
  setSeconds,
  type Locale,
} from "./infra/date";

// ─── infra/trpc ───────────────────────────────────────────────────────────────
export {
  createTRPCClient,
  createTRPCProxyClient,
  httpBatchLink,
  httpLink,
  splitLink,
  TRPCClientError,
  createTRPCReact,
  type AnyRouter,
} from "./infra/trpc";

// ─── infra/uuid ───────────────────────────────────────────────────────────────
export {
  generateId,
  isValidUUID,
  asUUID,
  type UUID,
} from "./infra/uuid";

// ─── infra/zod ────────────────────────────────────────────────────────────────
export {
  z,
  UuidSchema,
  IsoDateTimeSchema,
  createBrandedUuidSchema,
  zodErrorToFieldMap,
  zodParseOrThrow,
  zodSafeParse,
} from "./infra/zod";

// ─── integration-ai ───────────────────────────────────────────────────────────
export {
  DEFAULT_AI_MODEL,
  createUnconfiguredAiClient,
  IntegrationAiConfigurationError,
  IntegrationAiFlowError,
  type AiGenerateTextInput,
  type AiGenerateTextResult,
  type AiTextClient,
} from "./integration-ai";

// ─── integration-firebase ─────────────────────────────────────────────────────
export {
  firebaseClientApp,
  getFirebaseAuth,
  onFirebaseAuthStateChanged,
  signOutFirebase,
  getFirebaseFirestore,
  firestoreApi,
  getFirebaseFunctions,
  httpsCallable,
  getFirebaseStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  type User,
  type Firestore,
  type Functions,
  type FirebaseStorage,
  type StorageReference,
  type UploadResult,
  type UploadTask,
} from "./integration-firebase";

// ─── integration-queue ────────────────────────────────────────────────────────
export {
  createQStashClient,
  createNoOpQueueClient,
  createInMemoryQueuePublisher,
  IntegrationQueueError,
  QueuePublishError,
  type QStashConfig,
  type QueuePublishOptions,
  type QueuePublishResult,
  type QueueClient,
  type QueueMessage,
  type QueuePublisher,
} from "./integration-queue";

// ─── ui-components ────────────────────────────────────────────────────────────
export {
  PageSection,
  EmptyState,
  type PageSectionProps,
  type EmptyStateProps,
} from "./ui-components";

// ─── ui-editor ────────────────────────────────────────────────────────────────
export {
  RichTextEditor,
  ReadOnlyEditor,
  type RichTextEditorProps,
  type ReadOnlyEditorProps,
} from "./ui-editor";

// ─── ui-markdown ─────────────────────────────────────────────────────────────
export {
  MarkdownRenderer,
  type MarkdownRendererProps,
} from "./ui-markdown";

// ─── ui-shadcn ────────────────────────────────────────────────────────────────
export {
  cn,
  ThemeProvider,
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia,
  AlertDialogOverlay, AlertDialogPortal, AlertDialogTitle, AlertDialogTrigger,
  Alert, AlertTitle, AlertDescription, AlertAction,
  AspectRatio,
  Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarBadge,
  Badge, badgeVariants,
  Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage,
  BreadcrumbSeparator, BreadcrumbEllipsis,
  ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants,
  Button, buttonVariants,
  Calendar, CalendarDayButton,
  Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent,
  Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, useCarousel,
  type CarouselApi,
  ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle,
  Checkbox,
  Collapsible, CollapsibleTrigger, CollapsibleContent,
  Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxGroup,
  ComboboxLabel, ComboboxCollection, ComboboxEmpty, ComboboxSeparator, ComboboxChips,
  ComboboxChip, ComboboxChipsInput, ComboboxTrigger, ComboboxValue, useComboboxAnchor,
  Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup,
  CommandItem, CommandShortcut, CommandSeparator,
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuCheckboxItem, ContextMenuRadioItem, ContextMenuLabel, ContextMenuSeparator,
  ContextMenuShortcut, ContextMenuGroup, ContextMenuPortal, ContextMenuSub,
  ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuRadioGroup,
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogOverlay, DialogPortal, DialogTitle, DialogTrigger,
  DirectionProvider, useDirection,
  Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent,
  DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription,
  DropdownMenu, DropdownMenuPortal, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuGroup, DropdownMenuLabel, DropdownMenuItem, DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent,
  Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia,
  Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldLegend,
  FieldSeparator, FieldSet, FieldContent, FieldTitle,
  HoverCard, HoverCardTrigger, HoverCardContent,
  InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupInput, InputGroupTextarea,
  InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator,
  Input,
  Item, ItemMedia, ItemContent, ItemActions, ItemGroup, ItemSeparator, ItemTitle,
  ItemDescription, ItemHeader, ItemFooter,
  Kbd, KbdGroup,
  Label,
  Menubar, MenubarPortal, MenubarMenu, MenubarTrigger, MenubarContent, MenubarGroup,
  MenubarSeparator, MenubarLabel, MenubarItem, MenubarShortcut, MenubarCheckboxItem,
  MenubarRadioGroup, MenubarRadioItem, MenubarSub, MenubarSubTrigger, MenubarSubContent,
  NativeSelect, NativeSelectOptGroup, NativeSelectOption,
  NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem,
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,
  NavigationMenuPositioner,
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious,
  Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger,
  Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue,
  RadioGroup, RadioGroupItem,
  ResizableHandle, ResizablePanel, ResizablePanelGroup,
  ScrollArea, ScrollBar,
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton,
  SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue,
  Separator,
  Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter,
  SheetTitle, SheetDescription,
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset,
  SidebarMenu, SidebarMenuAction, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSkeleton, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
  SidebarProvider, SidebarRail, SidebarSeparator, SidebarTrigger, useSidebar,
  Skeleton,
  Slider,
  Toaster,
  Spinner,
  Switch,
  Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption,
  Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants,
  Textarea,
  ToggleGroup, ToggleGroupItem,
  Toggle, toggleVariants,
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "./ui-shadcn";

// ─── ui-visualization ─────────────────────────────────────────────────────────
export {
  StatCard,
  XuanwuLineChart,
  XuanwuBarChart,
  XuanwuPieChart,
  type StatCardProps,
  type DataPoint,
  type SeriesConfig,
  type XuanwuLineChartProps,
  type XuanwuBarChartProps,
  type PieDataPoint,
  type XuanwuPieChartProps,
} from "./ui-visualization";

// ─── infra/form ───────────────────────────────────────────────────────────────
export {
  useForm,
  useField,
  useStore,
  createFormHook,
  createFormHookContexts,
  formOptions,
  mergeForm,
  type FormApi,
  type FieldApi,
  type FieldMeta,
  type FormState,
  type ValidationError,
  type FormOptions,
  type FieldOptions,
  type UseFieldOptions,
  type FormValidateOrFn,
  type FieldValidateOrFn,
} from "./infra/form";

// ─── infra/table ──────────────────────────────────────────────────────────────
export {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getGroupedRowModel,
  getExpandedRowModel,
  getSelectedRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type VisibilityState,
  type ColumnOrderState,
  type ColumnResizeMode,
  type ColumnResizeDirection,
  type Table as TanstackTable,
  type Row as TanstackRow,
  type Cell as TanstackCell,
  type Header as TanstackHeader,
  type HeaderGroup,
  type CellContext,
  type HeaderContext,
  type ColumnHelper,
  type OnChangeFn,
  type Updater,
  type TableOptions,
  type FilterFn,
  type SortingFn,
} from "./infra/table";

// ─── infra/virtual ────────────────────────────────────────────────────────────
export {
  useVirtualizer,
  useWindowVirtualizer,
  type VirtualItem,
  type VirtualizerOptions,
  type Virtualizer,
  type Range,
} from "./infra/virtual";

// ─── ui-dnd ───────────────────────────────────────────────────────────────────
export {
  draggable,
  dropTargetForElements,
  monitorForElements,
  combine,
  reorder,
  attachClosestEdge,
  extractClosestEdge,
  reorderWithEdge,
  autoScrollForElements,
  DropIndicator,
  TreeDropIndicator,
  type Edge,
} from "./ui-dnd";

// ─── ui-vis ───────────────────────────────────────────────────────────────────
export {
  Network,
  DataSet,
  DataView,
  Timeline,
  type VisNetworkOptions,
  type VisNode,
  type VisEdge,
  type DataSetOptions,
  type TimelineOptions,
  type TimelineItem,
  type TimelineGroup,
} from "./ui-vis";
