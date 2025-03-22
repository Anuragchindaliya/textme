import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarSeparator,
} from "@/components/ui/menubar";

type MenuItem = {
  label?: string;
  onClick?: () => void;
  shortcut?: string;
  separator?: boolean;
  type?: "checkbox";
  checked?: boolean;
  disabled?: boolean;
  inset?: boolean;
};

export type MenuSection = {
  title: string;
  items: MenuItem[];
};

export interface DynamicMenuProps {
  menuData: MenuSection[];
}
export const menuData: MenuSection[] = [
  {
    title: "QR Code",
    items: [
      { label: "About QR Code", onClick: () => console.log("About QR Code") },
      { separator: true },
      { label: "Preferences", shortcut: "⌘,", onClick: () => console.log("Preferences") },
      { separator: true },
      { label: "Hide Music", shortcut: "⌘H", onClick: () => console.log("Hide Music") },
      { label: "Hide Others", shortcut: "⇧⌘H", onClick: () => console.log("Hide Others") },
      { separator: true },
      { label: "Quit Music", shortcut: "⌘Q", onClick: () => console.log("Quit Music") },
    ],
  },
  {
    title: "View",
    items: [
      { type: "checkbox", label: "Grid",shortcut: "⌘G", checked: true, onClick: () => console.log("Toggle Grid") },
      { type: "checkbox", label: "Show Playing Next", onClick: () => console.log("Toggle Playing Next") },
      { type: "checkbox", label: "Show Lyrics", checked: true },
      { separator: true },
      { label: "Show Status Bar", inset: true, disabled: true },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Manage Family", onClick: () => console.log("Manage Family"), inset: true },
      { label: "Add Account...", onClick: () => console.log("Add Account"), inset: true },
    ],
  },
];

export const DynamicMenu: React.FC<DynamicMenuProps> = ({ menuData }) => {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      {menuData.map((menu, index) => (
        <MenubarMenu key={index}>
          <MenubarTrigger className={index===0?"font-bold":""}>{menu.title}</MenubarTrigger>
          <MenubarContent>
            {menu.items.map((item, idx) =>
              item.separator ? (
                <MenubarSeparator key={idx} />
              ) : item.type === "checkbox" ? (
                <MenubarCheckboxItem
                  key={idx}
                  checked={item.checked}
                  onClick={item.onClick}
                  disabled={item.disabled}
                >
                  {item.label}
                  {item.shortcut && (
                    <span className="ml-auto text-xs opacity-50">{item.shortcut}</span>
                  )}
                </MenubarCheckboxItem>
              ) : (
                <MenubarItem
                  key={idx}
                  onClick={item.onClick}
                  inset={item.inset}
                  disabled={item.disabled}
                >
                  {item.label}
                  {item.shortcut && (
                    <span className="ml-auto text-xs opacity-50">{item.shortcut}</span>
                  )}
                </MenubarItem>
              )
            )}
          </MenubarContent>
        </MenubarMenu>
      ))}
    </Menubar>
  );
};
