import NavItem from "./NavItem";

export default function Nav() {
  return (
    <nav className="hidden shrink-0 items-center gap-10 md:flex">
      <NavItem href="#about">Художница</NavItem>
      <NavItem href="#mugs">Работы</NavItem>
      <NavItem href="#order">Заказ</NavItem>
    </nav>
  );
}
