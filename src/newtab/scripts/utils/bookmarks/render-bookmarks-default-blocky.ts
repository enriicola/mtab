import { Config } from "src/utils/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  createFolderArea,
  renderBookmarkNodes
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils";
import { convertBrowserBookmarksToBookmarkNodes } from "src/newtab/scripts/utils/bookmarks/convert-browser-bookmarks";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";
import { genid } from "src/utils/genid";

// Function to generate responsive bookmark CSS based on screen width
const generateResponsiveBookmarkCSS = (maxCols: number): string => {
  const baseCSS = `
    .default-blocky-full-width {
      max-width: none !important; 
      width: 95% !important; 
      top: 50% !important; 
      transform: translateY(-50%) !important;
    }
    
    @media (min-width: 768px) {
      .default-blocky-full-width {
        width: 90% !important;
      }
    }
  `;

  // Generate responsive grid columns based on available space
  // Very small screens: 1 column
  // Small screens: 2 columns
  // Medium screens: 3-4 columns based on maxCols
  // Large screens: use maxCols but cap at reasonable limit
  // Extra large screens: can use full maxCols

  const responsiveGrid = `
    .bookmarks-cols {
      grid-template-columns: 1fr;
    }
    
    @media (min-width: 480px) {
      .bookmarks-cols {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 640px) {
      .bookmarks-cols {
        grid-template-columns: repeat(${Math.min(3, maxCols)}, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 768px) {
      .bookmarks-cols {
        grid-template-columns: repeat(${Math.min(4, maxCols)}, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 1024px) {
      .bookmarks-cols {
        grid-template-columns: repeat(${Math.min(6, maxCols)}, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 1280px) {
      .bookmarks-cols {
        grid-template-columns: repeat(${Math.min(8, maxCols)}, minmax(0, 1fr));
      }
    }
    
    @media (min-width: 1536px) {
      .bookmarks-cols {
        grid-template-columns: repeat(${Math.min(10, maxCols)}, minmax(0, 1fr));
      }
    }
  `;

  return baseCSS + responsiveGrid;
};

// animations handled separately
export const renderDefaultBlockyBookmarks = (config: Config) => {
  // Add a class to the content container to expand it for default-blocky bookmarks
  const contentEl = document.getElementById("content");
  if (contentEl) {
    contentEl.classList.add("default-blocky-full-width");
  }

  bookmarksContainerEl.classList.add("w-full", "grid", "gap-2", "grid-flow-row");

  // const defaultBlockyBookmarkCss = `
  // .default-blocky-bookmarks-cols {
  //   grid-template-columns: 1fr 1fr;
  // }

  // @media (min-width: 768px) {
  //   .default-blocky-bookmarks-cols {
  //     grid-template-columns: repeat(${config.bookmarks.defaultBlockyCols}, minmax(0, 1fr));
  //   }
  // }`;

  // Generate responsive CSS that adapts to screen size
  const responsiveCSS = generateResponsiveBookmarkCSS(config.bookmarks.defaultBlockyCols);
  insertCSS(responsiveCSS);

  const rootFolderUUID = genid();
  const rootFolderAreaEl = createFolderArea(rootFolderUUID, true);

  convertBrowserBookmarksToBookmarkNodes(
    config.bookmarks.bookmarksLocationFirefox,
    config.bookmarks.defaultBlockyColorType,
    config.bookmarks.defaultBlockyColor,
    config.bookmarks.defaultFaviconSource
  ).then((bookmarkNodes) => {
    renderBookmarkNodes(bookmarkNodes, rootFolderAreaEl, config.animations.enabled, config);
  });
};
