import { textmeApi, endpoints, baseUrl } from "@/app/services";
import { FamilyTree } from "./type";

type SheetDBRow = {
  id: string;
  name: string;        // family tree name
  tree_json: string;   // stored JSON
}[];

export const familyTreeApi = textmeApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // -------------------------------
    // GET FAMILY TREE BY NAME
    // -------------------------------
    getFamilyTree: builder.query<FamilyTree | null, string>({
      query: (treeName) => ({
        url: `${endpoints.SEARCH}?name=${treeName}&sheet=family_tree`,
        method: "GET",
      }),
      transformResponse: (response: SheetDBRow) => {
        if (!response?.length) return null;
        return JSON.parse(response[0].tree_json) as FamilyTree;
      },
    }),

    // -------------------------------
    // CREATE FAMILY TREE (POST)
    // -------------------------------
    createFamilyTree: builder.mutation<any, { name: string; tree: FamilyTree }>({
      query: ({ name, tree }) => ({
        url: `${baseUrl}?sheet=family_tree`,
        method: "POST",
        body: [
          {
            id: "INCREMENT",
            name,
            tree_json: JSON.stringify(tree),
          },
        ],
      }),
    }),

    // -------------------------------
    // UPDATE FAMILY TREE (PATCH)
    // -------------------------------
    updateFamilyTree: builder.mutation<
      any,
      { name: string; tree: FamilyTree }
    >({
      query: ({ name, tree }) => ({
        url: `/${name}?sheet=family_tree`,
        method: "PATCH",
        body: {
          data: {
            tree_json: JSON.stringify(tree),
          },
        },
      }),
    }),

  }),
});

// Hooks
export const {
  useGetFamilyTreeQuery,
  useCreateFamilyTreeMutation,
  useUpdateFamilyTreeMutation
} = familyTreeApi;
