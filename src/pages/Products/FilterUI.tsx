import { useAppSelector } from "@/app/hooks"
import { selectCarts } from "@/features/products/cartSlice"
import { ROUTES } from "@/Router"
import { Link } from "lucide-react"
import React from "react"

const FilterUI = () => {
  const carts = useAppSelector(selectCarts)

  return (
    <div>
      <div className="flex items-center space-x-4">
        <button
          id="sortDropdownButton1"
          data-dropdown-toggle="dropdownSort1"
          type="button"
          className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
        >
          <svg
            className="-ms-0.5 me-2 h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"
            />
          </svg>
          Sort
          <svg
            className="-me-0.5 ms-2 h-4 w-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>
        <div
          id="dropdownSort1"
          className="z-50 hidden w-40 divide-y divide-gray-100 rounded-lg bg-white shadow dark:bg-gray-700"
          data-popper-placement="bottom"
        >
          <ul
            className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400"
            aria-labelledby="sortDropdownButton"
          >
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                The most popular{" "}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                Newest{" "}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                Increasing price{" "}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                Decreasing price{" "}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                No. reviews{" "}
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {" "}
                Discount %{" "}
              </a>
            </li>
          </ul>
        </div>
        <Link
          to={ROUTES.CART}
          id="sortDropdownButton1"
          data-dropdown-toggle="dropdownSort1"
          type="button"
          className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
        >
          Cart {carts.length}
        </Link>

        {/* {email ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                            <AvatarFallback>
                              {email.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-xs leading-none text-muted-foreground">
                              {email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <Link to={"/settings"}>
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link to={ROUTES.LOGIN}>Login</Link>
                  )} */}
      </div>
      <button
        data-modal-toggle="filterModal"
        data-modal-target="filterModal"
        type="button"
        className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
      >
        <svg
          className="-ms-0.5 me-2 h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={2}
            d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
          />
        </svg>
        Filters
        <svg
          className="-me-0.5 ms-2 h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>
      {/* Filter modal */}
      <form
        action="#"
        method="get"
        id="filterModal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed left-0 right-0 top-0 z-50 hidden h-modal w-full overflow-y-auto overflow-x-hidden p-4 md:inset-0 md:h-full"
      >
        <div className="relative h-full w-full max-w-xl md:h-auto">
          {/* Modal content */}
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-800">
            {/* Modal header */}
            <div className="flex items-start justify-between rounded-t p-4 md:p-5">
              <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                Filters
              </h3>
              <button
                type="button"
                className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="filterModal"
              >
                <svg
                  className="h-5 w-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="px-4 md:px-5">
              <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul
                  className="-mb-px flex flex-wrap text-center text-sm font-medium"
                  id="myTab"
                  data-tabs-toggle="#myTabContent"
                  role="tablist"
                >
                  <li className="mr-1" role="presentation">
                    <button
                      className="inline-block pb-2 pr-1"
                      id="brand-tab"
                      data-tabs-target="#brand"
                      type="button"
                      role="tab"
                      aria-controls="profile"
                      aria-selected="false"
                    >
                      Brand
                    </button>
                  </li>
                  <li className="mr-1" role="presentation">
                    <button
                      className="inline-block px-2 pb-2 hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300"
                      id="advanced-filers-tab"
                      data-tabs-target="#advanced-filters"
                      type="button"
                      role="tab"
                      aria-controls="advanced-filters"
                      aria-selected="false"
                    >
                      Advanced Filters
                    </button>
                  </li>
                </ul>
              </div>
              <div id="myTabContent">
                <div
                  className="grid grid-cols-2 gap-4 md:grid-cols-3"
                  id="brand"
                  role="tabpanel"
                  aria-labelledby="brand-tab"
                >
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      A
                    </h5>
                    <div className="flex items-center">
                      <input
                        id="apple"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="apple"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Apple (56){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="asus"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="asus"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Asus (97){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="acer"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="acer"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Acer (234){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="allview"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="allview"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Allview (45){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="atari"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="asus"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Atari (176){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="amd"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="amd"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        AMD (49){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="aruba"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="aruba"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Aruba (16){" "}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      B
                    </h5>
                    <div className="flex items-center">
                      <input
                        id="beats"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="beats"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Beats (56){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="bose"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="bose"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Bose (97){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="benq"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="benq"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        BenQ (45){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="bosch"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="bosch"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Bosch (176){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="brother"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="brother"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Brother (176){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="biostar"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="biostar"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Biostar (49){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="braun"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="braun"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Braun (16){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="blaupunkt"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="blaupunkt"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Blaupunkt (45){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="benq2"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="benq2"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        BenQ (23){" "}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      C
                    </h5>
                    <div className="flex items-center">
                      <input
                        id="canon"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="canon"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Canon (49){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cisco"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="cisco"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Cisco (97){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="cowon"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="cowon"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Cowon (234){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="clevo"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="clevo"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Clevo (45){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="corsair"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="corsair"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Corsair (15){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="csl"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="csl"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Canon (49){" "}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      D
                    </h5>
                    <div className="flex items-center">
                      <input
                        id="dell"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="dell"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dell (56){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dogfish"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="dogfish"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dogfish (24){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dyson"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="dyson"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dyson (234){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="dobe"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="dobe"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Dobe (5){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="digitus"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="digitus"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Digitus (1){" "}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      E
                    </h5>
                    <div className="flex items-center">
                      <input
                        id="emetec"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="emetec"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Emetec (56){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="extreme"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="extreme"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Extreme (10){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="elgato"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="elgato"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Elgato (234){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="emerson"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="emerson"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Emerson (45){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="emi"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="emi"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        EMI (176){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="fugoo"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="fugoo"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Fugoo (49){" "}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-lg font-medium uppercase text-black dark:text-white">
                      F
                    </h5>
                    <div className="flex items-center">
                      <input
                        id="fujitsu"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="fujitsu"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Fujitsu (97){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="fitbit"
                        type="checkbox"
                        defaultValue=""
                        defaultChecked
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="fitbit"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Fitbit (56){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="foxconn"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="foxconn"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Foxconn (234){" "}
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="floston"
                        type="checkbox"
                        defaultValue=""
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                      />
                      <label
                        htmlFor="floston"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {" "}
                        Floston (45){" "}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="space-y-4"
                id="advanced-filters"
                role="tabpanel"
                aria-labelledby="advanced-filters-tab"
              >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="min-price"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Min Price{" "}
                      </label>
                      <input
                        id="min-price"
                        type="range"
                        min={0}
                        max={7000}
                        defaultValue={300}
                        step={1}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="max-price"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Max Price{" "}
                      </label>
                      <input
                        id="max-price"
                        type="range"
                        min={0}
                        max={7000}
                        defaultValue={3500}
                        step={1}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-between space-x-2">
                      <input
                        type="number"
                        id="min-price-input"
                        defaultValue={300}
                        min={0}
                        max={7000}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 "
                        placeholder=""
                        required
                      />
                      <div className="shrink-0 text-sm font-medium dark:text-gray-300">
                        to
                      </div>
                      <input
                        type="number"
                        id="max-price-input"
                        defaultValue={3500}
                        min={0}
                        max={7000}
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="min-delivery-time"
                        className="block text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {" "}
                        Min Delivery Time (Days){" "}
                      </label>
                      <input
                        id="min-delivery-time"
                        type="range"
                        min={3}
                        max={50}
                        defaultValue={30}
                        step={1}
                        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
                      />
                    </div>
                    <input
                      type="number"
                      id="min-delivery-time-input"
                      defaultValue={30}
                      min={3}
                      max={50}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 "
                      placeholder=""
                      required
                    />
                  </div>
                </div>
                <div>
                  <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                    Condition
                  </h6>
                  <ul className="flex w-full items-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                    <li className="w-full border-r border-gray-200 dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="condition-all"
                          type="radio"
                          defaultValue=""
                          name="list-radio"
                          defaultChecked
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="condition-all"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          All{" "}
                        </label>
                      </div>
                    </li>
                    <li className="w-full border-r border-gray-200 dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
                          id="condition-new"
                          type="radio"
                          defaultValue=""
                          name="list-radio"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="condition-new"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          New{" "}
                        </label>
                      </div>
                    </li>
                    <li className="w-full">
                      <div className="flex items-center pl-3">
                        <input
                          id="condition-used"
                          type="radio"
                          defaultValue=""
                          name="list-radio"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="condition-used"
                          className="ml-2 w-full py-3 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Used{" "}
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Colour
                    </h6>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="blue"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="blue"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-blue-600" />
                          Blue
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="gray"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="gray"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-gray-400" />
                          Gray
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="green"
                          type="checkbox"
                          defaultValue=""
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="green"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-green-400" />
                          Green
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="pink"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="pink"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-pink-400" />
                          Pink
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="red"
                          type="checkbox"
                          defaultValue=""
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="red"
                          className="ml-2 flex items-center text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          <div className="mr-2 h-3.5 w-3.5 rounded-full bg-red-500" />
                          Red
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Rating
                    </h6>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="five-stars"
                          type="radio"
                          defaultValue=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="five-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="four-stars"
                          type="radio"
                          defaultValue=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="four-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="three-stars"
                          type="radio"
                          defaultValue=""
                          name="rating"
                          defaultChecked
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="three-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="two-stars"
                          type="radio"
                          defaultValue=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="two-stars"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="one-star"
                          type="radio"
                          defaultValue=""
                          name="rating"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="one-star"
                          className="ml-2 flex items-center"
                        >
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>First star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Second star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Third star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fourth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <svg
                            aria-hidden="true"
                            className="h-5 w-5 text-gray-300 dark:text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Fifth star</title>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                      Weight
                    </h6>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          id="under-1-kg"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="under-1-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Under 1 kg{" "}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="1-1-5-kg"
                          type="checkbox"
                          defaultValue=""
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="1-1-5-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          1-1,5 kg{" "}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="1-5-2-kg"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="1-5-2-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          1,5-2 kg{" "}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="2-5-3-kg"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="2-5-3-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          2,5-3 kg{" "}
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="over-3-kg"
                          type="checkbox"
                          defaultValue=""
                          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                        />
                        <label
                          htmlFor="over-3-kg"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          {" "}
                          Over 3 kg{" "}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h6 className="mb-2 text-sm font-medium text-black dark:text-white">
                    Delivery type
                  </h6>
                  <ul className="grid grid-cols-2 gap-4">
                    <li>
                      <input
                        type="radio"
                        id="delivery-usa"
                        name="delivery"
                        defaultValue="delivery-usa"
                        className="peer hidden"
                        defaultChecked
                      />
                      <label
                        htmlFor="delivery-usa"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            USA
                          </div>
                          <div className="w-full">Delivery only for USA</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="delivery-europe"
                        name="delivery"
                        defaultValue="delivery-europe"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="delivery-europe"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Europe
                          </div>
                          <div className="w-full">Delivery only for USA</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="delivery-asia"
                        name="delivery"
                        defaultValue="delivery-asia"
                        className="peer hidden"
                        defaultChecked
                      />
                      <label
                        htmlFor="delivery-asia"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Asia
                          </div>
                          <div className="w-full">Delivery only for Asia</div>
                        </div>
                      </label>
                    </li>
                    <li>
                      <input
                        type="radio"
                        id="delivery-australia"
                        name="delivery"
                        defaultValue="delivery-australia"
                        className="peer hidden"
                      />
                      <label
                        htmlFor="delivery-australia"
                        className="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-blue-600 peer-checked:text-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-blue-500 md:p-5"
                      >
                        <div className="block">
                          <div className="w-full text-lg font-semibold">
                            Australia
                          </div>
                          <div className="w-full">
                            Delivery only for Australia
                          </div>
                        </div>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center space-x-4 rounded-b p-4 dark:border-gray-600 md:p-5">
              <button
                type="submit"
                className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800"
              >
                Show 50 results
              </button>
              <button
                type="reset"
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default FilterUI
