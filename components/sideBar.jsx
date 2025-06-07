import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import CodeIcon from '@mui/icons-material/Code';
import LinkIcon from '@mui/icons-material/Link';
import MailIcon from '@mui/icons-material/Mail';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';

const SideBar = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [allOpen, setAllOpen] = useState(false);

  const toggleCategory = (category) => {
    if (allOpen) setAllOpen(false);
    setOpenCategory(openCategory === category ? null : category);
  };

  const toggleAll = () => {
    if (allOpen) {
      setOpenCategory(null);
      setAllOpen(false);
    } else {
      setAllOpen(true);
      setOpenCategory(null);
    }
  };

  const isOpen = (category) => allOpen || openCategory === category;

  return (
    <div className="sideBarDiv sideBar">

      {/* Eye icon toggle all */}
      <div 
        className="sideBarViewButton"
        onClick={toggleAll}
        title={allOpen ? "Collapse all" : "Expand all"}
      >
        {allOpen ? <VisibilityOffIcon /> : <VisibilityIcon />}
        <span style={{ marginLeft: 8 }}>{allOpen ? "Hide All" : "View All"}</span>
      </div>

      {/* Static Top Links */}
      <SidebarLink href="/dashboard" icon={<DashboardIcon />} label="Dashboard" />
      <SidebarLink href="/inbox" icon={<MailIcon />} label="Inbox" />

      {/* Dropdown: Projects */}
      <SidebarCategory title="Tech" isOpen={isOpen('projects')} toggle={() => toggleCategory('projects')}>
        <SidebarLink href="/projects" icon={<FolderCopyIcon />} label="Projects" />
        <SidebarLink href="/links" icon={<LinkIcon />} label="Links" />
        <SidebarLink href="/codes" icon={<CodeIcon />} label="Codes" />
      </SidebarCategory>

      {/* Dropdown: Guides */}
      <SidebarCategory title="Guides" isOpen={isOpen('guides')} toggle={() => toggleCategory('guides')}>
        <SidebarLink href="/guides" icon={<EmojiObjectsIcon />} label="Guides" />
      </SidebarCategory>

      {/* Dropdown: Notes */}
      <SidebarCategory title="Jalen" isOpen={isOpen('notes')} toggle={() => toggleCategory('notes')}>
        <SidebarLink href="/notes" icon={<TextSnippetIcon />} label="Notes" />
        <SidebarLink href="/dates" icon={<EditCalendarIcon />} label="Dates" />
      </SidebarCategory>
    </div>
  );
};

// Reusable sidebar link
const SidebarLink = ({ href, icon, label }) => (
  <Link href={href} passHref>
    <div className="sideBarLinkDiv">
      <div className="sideBarLinkIconDiv">{icon}</div>
      <div className="sideBarLink">{label}</div>
    </div>
  </Link>
);

// Reusable dropdown category
const SidebarCategory = ({ title, isOpen, toggle, children }) => (
  <div className="sideBarCategory">
    <div className="sideBarCategoryHeader" onClick={toggle}>
      <span>{title}</span>
      {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </div>
    {isOpen && <div className="sideBarCategoryLinks">{children}</div>}
  </div>
);

export default SideBar;
