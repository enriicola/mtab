import { Config } from "src/utils/config";
import { bookmarksContainerEl } from "src/newtab/scripts/ui";
import {
  createFolderArea,
  renderBookmarkNodes
} from "src/newtab/scripts/utils/bookmarks/bookmark-render-utils";
import { insertCSS } from "src/newtab/scripts/utils/insert-css";
import { genid } from "src/utils/genid";

// Function to generate responsive bookmark CSS for user-defined bookmarks
const generateResponsiveUserDefinedCSS = (maxCols: number): string => {
  // Generate responsive grid columns based on available space
  return `
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
};

// animations handled separately
export const renderBookmarkNodeBookmarks = (config: Config) => {
  bookmarksContainerEl.classList.add("w-full", "grid", "grid-flow-row", "gap-2");

  // const BookmarkNodeBookmarkCss = `
  // .user-defined-bookmarks-cols {
  //   grid-template-columns: 1fr 1fr;
  // }

  // @media (min-width: 768px) {
  //   .user-defined-bookmarks-cols {
  //     grid-template-columns: repeat(${config.bookmarks.userDefinedCols}, minmax(0, 1fr));
  //   }
  // }`;

  // Generate responsive CSS that adapts to screen size
  const responsiveCSS = generateResponsiveUserDefinedCSS(config.bookmarks.userDefinedCols);
  insertCSS(responsiveCSS);

  const rootFolderUUID = genid();
  const rootFolderAreaEl = createFolderArea(rootFolderUUID, true);

  renderBookmarkNodes(
    config.bookmarks.userDefined,
    rootFolderAreaEl,
    config.animations.enabled,
    config
  );
};
