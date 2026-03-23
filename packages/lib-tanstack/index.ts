/**
 * @module libs/tanstack
 * Thin wrapper for TanStack React contracts.
 */

// React Query
export {
	QueryClient,
	QueryClientProvider,
	HydrationBoundary,
	dehydrate,
	hydrate,
	queryOptions,
	mutationOptions,
	infiniteQueryOptions,
	useQuery,
	useQueries,
	useInfiniteQuery,
	useSuspenseQuery,
	useSuspenseQueries,
	useSuspenseInfiniteQuery,
	useMutation,
	useMutationState,
	useQueryClient,
	useIsFetching,
	useIsMutating,
	usePrefetchQuery,
	usePrefetchInfiniteQuery,
	QueryErrorResetBoundary,
	useQueryErrorResetBoundary,
	keepPreviousData,
	skipToken,
} from "@tanstack/react-query";

// React Form
export {
	useForm,
	useField,
	useFieldGroup,
	Field,
	createFormHook,
	createFormHookContexts,
	formOptions,
	revalidateLogic,
	defaultValidationLogic,
} from "@tanstack/react-form";

// React Table
export {
	flexRender,
	useReactTable,
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getExpandedRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
} from "@tanstack/react-table";

export type {
	SortingState,
	ColumnFiltersState,
	ColumnDef,
	Row,
	Column,
	Table,
	HeaderGroup,
	Header,
	Cell,
	RowData,
	FilterFn,
	SortingFn,
	VisibilityState,
	RowSelectionState,
	GroupingState,
	ExpandedState,
} from "@tanstack/react-table";

// React Virtual
export {
	Virtualizer,
	defaultRangeExtractor,
	elementScroll,
	windowScroll,
	useVirtualizer,
	useWindowVirtualizer,
} from "@tanstack/react-virtual";
