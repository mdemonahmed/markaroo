/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/assets/apps/dashboard-markaroo/AdminShell.tsx"
/*!*****************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/AdminShell.tsx ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminShell: () => (/* binding */ AdminShell)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/badge-check.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square-kanban.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/messages-square.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/send.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/settings.mjs");
/* harmony import */ var _views_OverviewView__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./views/OverviewView */ "./resources/assets/apps/dashboard-markaroo/views/OverviewView.tsx");
/* harmony import */ var _views_TaskListView__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./views/TaskListView */ "./resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx");
/* harmony import */ var _views_StatusBoardView__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./views/StatusBoardView */ "./resources/assets/apps/dashboard-markaroo/views/StatusBoardView.tsx");
/* harmony import */ var _views_SettingsView__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./views/SettingsView */ "./resources/assets/apps/dashboard-markaroo/views/SettingsView.tsx");
/* harmony import */ var _views_ApprovalsView__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./views/ApprovalsView */ "./resources/assets/apps/dashboard-markaroo/views/ApprovalsView.tsx");
/* harmony import */ var _views_EmailNotificationView__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./views/EmailNotificationView */ "./resources/assets/apps/dashboard-markaroo/views/EmailNotificationView.tsx");
/* harmony import */ var _views_PluginFeedbackView__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./views/PluginFeedbackView */ "./resources/assets/apps/dashboard-markaroo/views/PluginFeedbackView.tsx");
/* harmony import */ var _views_HowToUseView__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./views/HowToUseView */ "./resources/assets/apps/dashboard-markaroo/views/HowToUseView.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__);












const TAB_IDS = ['overview', 'tasks', 'board', 'approvals', 'email-notification', 'settings', 'plugin-feedback', 'how-to-use'];
// Hash routes are `#tab` or `#tab?key=value` (e.g. #tasks?status=open).
function parseHash() {
  const raw = window.location.hash.replace('#', '');
  const [tab, query] = raw.split('?');
  return {
    tab: TAB_IDS.includes(tab) ? tab : 'overview',
    params: new URLSearchParams(query ?? '')
  };
}
function BrandMark() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("svg", {
    className: "markaroo-topnav__logo",
    viewBox: "0 0 1309 243",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    role: "img",
    "aria-label": "Markaroo",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("g", {
      clipPath: "url(#clip0_1_44)",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M12.3172 1.16672C16.1715 0.932829 20.139 0.574035 23.7975 2.08907C33.5437 6.12503 82.3567 50.7931 93.6615 60.8265C100.042 66.4891 107.131 74.336 114.909 77.8691C119.086 79.7667 123.283 78.336 127.101 76.2298C133.301 72.81 138.928 66.7571 144.237 62.0583C157.364 50.4395 204.016 5.81766 214.173 2.14672C218.392 0.621925 223.757 0.0181326 227.932 2.00643C231.524 3.71707 233.769 7.24277 235.035 10.8984C236.075 13.9031 236.537 17.1111 236.66 20.2789C237.113 31.8971 236.599 43.7569 236.587 55.4033L236.555 127.8L236.525 195.175C236.496 210.507 242.09 240.606 221.26 241.566C197.986 242.639 174.513 242.011 151.204 241.985C124.972 241.956 150.113 210.029 156.098 199.944C161.644 190.631 171.412 175.376 174.397 165.291C178.33 151.801 176.744 137.301 169.988 124.982C162.511 111.157 149.856 100.869 134.803 96.3762C120.522 92.1991 105.16 93.9727 92.2027 101.295C79.3342 108.418 69.2437 120.669 64.7145 135.151C54.2932 168.467 82.722 195.723 96.4102 223.435C100.824 232.37 102.537 242.781 88.9485 242.214C63.282 241.144 37.503 243.521 12.0652 241.156C-3.135 239.57 0.741742 202.643 0.737242 189.377L0.760497 120.143L0.816745 58.089C0.746244 44.6276 -0.564754 25.5425 2.08425 12.1108C3.168 6.61383 7.46924 3.58692 12.3172 1.16672Z",
        fill: "#5B4FCF"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M455.45 52.7906L485.136 52.7185L485.142 202.797C474.986 202.845 464.828 202.841 454.672 202.784L454.671 153.81L454.501 109.528C438.363 135.548 422.422 161.691 406.682 187.955L393.428 188.069C377.493 161.643 361.289 135.382 344.818 109.288C345.692 139.111 344.959 172.768 344.969 202.823L314.801 202.845L314.871 52.7778L344.136 52.747L400.141 144.363L455.45 52.7906Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M553.154 89.8024C569.023 86.0718 585.872 94.4892 596.859 105.396C596.508 101.987 596.665 95.8988 596.66 92.2726C606.332 92.1203 616.343 92.3072 626.041 92.3642C624.767 126.601 625.711 168.135 625.949 202.841L596.707 202.829C596.715 200.094 597.107 192.283 595.981 190.467L594.779 191.476C577.187 209.425 545.811 209.851 527.118 195.007C487.536 163.576 501.408 97.6755 553.154 89.8024ZM572.641 178.299C589.576 174.198 600.046 157.205 596.101 140.219C592.157 123.235 575.272 112.604 558.266 116.398C541.041 120.241 530.252 137.405 534.248 154.608C538.244 171.811 555.489 182.453 572.641 178.299Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M896.722 89.7881C913.275 86.7076 928.44 93.8181 939.975 105.16V92.3514C949.245 92.0444 959.588 92.2899 969.03 92.1863L969.038 202.781L940.02 202.826L939.84 189.795L935.332 194.351C929.1 199.786 921.472 203.378 913.312 204.722C839.827 217.485 820.057 102.449 896.722 89.7881ZM915.24 178.528C932.467 174.817 943.388 157.79 939.593 140.568C935.798 123.346 918.728 112.499 901.545 116.385C884.475 120.243 873.735 137.176 877.5 154.276C881.272 171.375 898.132 182.213 915.24 178.528Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M1117.17 89.978C1148.83 85.5622 1178.06 107.707 1182.4 139.403C1186.75 171.098 1164.56 200.304 1132.88 204.587C1101.3 208.857 1072.22 186.73 1067.89 155.129C1063.56 123.528 1085.6 94.3811 1117.17 89.978ZM1131.32 178.008C1148.29 174.686 1159.32 158.202 1155.94 141.236C1152.57 124.269 1136.05 113.279 1119.12 116.719C1102.26 120.141 1091.34 136.565 1094.71 153.448C1098.07 170.332 1114.44 181.313 1131.32 178.008Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M736.035 49.2379C745.867 49.0578 756.12 49.1892 765.983 49.1704L766.005 143.278C779.632 126.729 796.035 108.446 810.397 92.4169C822.187 91.974 836.085 92.2232 847.807 92.4694L799.792 144.998C807.682 155.052 821.28 169.538 830.017 179.449C836.94 187.19 843.795 194.995 850.575 202.863C838.642 202.585 825.255 202.865 813.233 202.874L765.922 148.915C766.35 166.643 765.877 184.933 766.23 202.859L735.997 202.844C736.935 152.719 736.162 99.5687 736.035 49.2379Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M1244.58 89.8311C1258.92 88.2998 1273.08 91.3683 1284.91 99.7909C1297.22 108.612 1305.48 122.001 1307.86 136.965C1313.6 171.106 1293.14 198.545 1259.29 204.131C1257.47 174.593 1274.18 178.378 1281.14 157.679C1283.89 149.638 1283.33 140.83 1279.59 133.198C1274.95 123.852 1268.34 119.544 1258.85 116.342C1249.34 114.045 1238.43 116.746 1231.29 123.412C1217.66 136.14 1217.09 153.213 1227.76 168.049C1232.74 174.974 1239.67 180.88 1242.85 188.918C1244.78 193.734 1244.29 198.901 1244.17 204.014C1233.95 203.004 1225.2 199.828 1216.97 193.599C1205.04 184.483 1197.22 170.996 1195.23 156.109C1190.67 123.183 1211.34 94.3024 1244.58 89.8311Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M1045.51 91.2436C1052.2 90.6544 1056.08 90.9284 1062.75 91.6242C1063.01 100.782 1062.81 110.76 1062.8 119.979C1058.74 119.162 1054.62 118.71 1050.49 118.629C1037.39 118.42 1023.5 126.457 1022.1 139.548C1019.99 159.163 1021.15 182.944 1021.15 202.777C1012 202.892 1002.71 202.815 993.562 202.828C992.31 202.833 992.745 202.918 991.65 202.17C991.11 165.89 991.552 128.653 991.582 92.3028C1001.31 92.1819 1011.03 92.2059 1020.76 92.3741L1020.73 108.462C1027.55 97.8948 1033.51 94.12 1045.51 91.2436Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M703.552 91.2585C709.365 90.6153 713.978 91.0228 719.73 91.7517L719.835 120.159C715.463 119.146 710.993 118.63 706.508 118.622C693.533 118.675 680.813 127.08 679.305 139.916C677.01 159.512 678.142 183.046 678.24 202.811L650.213 202.835L649.275 202.606C648.308 200.364 648.803 103.176 648.78 92.4167C658.44 92.0482 668.43 92.2561 678.128 92.3387L678.052 109.212C678.577 108.283 679.133 107.372 679.718 106.479C685.958 96.9332 692.737 93.5044 703.552 91.2585Z",
        fill: "#030D25"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M115.249 129.639C127.338 127.253 139.079 135.097 141.515 147.186C143.951 159.274 136.165 171.058 124.097 173.549C111.955 176.054 100.091 168.203 97.641 156.04C95.19 143.877 103.086 132.039 115.249 129.639Z",
        fill: "#5B4FCF"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("path", {
        d: "M1248.05 134.891C1255.09 132.863 1262.46 136.868 1264.59 143.884C1266.72 150.899 1262.83 158.327 1255.85 160.562C1251.24 162.038 1246.2 160.915 1242.65 157.625C1239.11 154.336 1237.6 149.388 1238.72 144.68C1239.84 139.97 1243.4 136.23 1248.05 134.891Z",
        fill: "#5B4FCF"
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("defs", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("clipPath", {
        id: "clip0_1_44",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("rect", {
          width: "1309",
          height: "243",
          fill: "white"
        })
      })
    })]
  });
}
const NAV_ICON = {
  className: 'markaroo-nav__icon',
  size: 18,
  strokeWidth: 2
};
function getTabs() {
  return [{
    id: 'overview',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Dashboard', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'tasks',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Feedback', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'board',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Board', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'approvals',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approvals', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'email-notification',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email Notification', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'settings',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'plugin-feedback',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Give us Feedback', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], {
      ...NAV_ICON
    })
  }, {
    id: 'how-to-use',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('How to Use', 'markaroo'),
    icon: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
      ...NAV_ICON
    })
  }];
}
function AdminShell() {
  const [route, setRoute] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(parseHash);
  const {
    tab,
    params
  } = route;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    window.dispatchEvent(new CustomEvent('markaroo:admin-ready', {
      detail: {
        tab
      }
    }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the view in sync with the hash so stat-box deep links
  // (#tasks?status=open) work from anywhere.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  function switchTab(t) {
    window.location.hash = t; // hashchange listener updates state
  }
  const tabs = getTabs();
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
    className: "markaroo-app markaroo-admin",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("header", {
      className: "markaroo-topnav",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("div", {
        className: "markaroo-topnav__brand",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(BrandMark, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
          className: "markaroo-topnav__name sr_only",
          children: "Markaroo"
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("nav", {
        className: "markaroo-topnav__nav",
        "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Markaroo navigation', 'markaroo'),
        children: tabs.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("button", {
          type: "button",
          className: `markaroo-topnav__item${tab === t.id ? ' markaroo-topnav__item--active' : ''}`,
          onClick: () => switchTab(t.id),
          "aria-current": tab === t.id ? 'page' : undefined,
          children: [t.icon, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)("span", {
            children: t.label
          })]
        }, t.id))
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsxs)("main", {
      className: "markaroo-admin__main",
      children: [tab === 'overview' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_OverviewView__WEBPACK_IMPORTED_MODULE_10__.OverviewView, {}), tab === 'tasks' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_TaskListView__WEBPACK_IMPORTED_MODULE_11__.TaskListView, {
        initialStatus: params.get('status') ?? undefined,
        initialPageKey: params.get('page_key') ?? undefined
      }, params.toString()), tab === 'board' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_StatusBoardView__WEBPACK_IMPORTED_MODULE_12__.StatusBoardView, {}), tab === 'approvals' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_ApprovalsView__WEBPACK_IMPORTED_MODULE_14__.ApprovalsView, {}), tab === 'email-notification' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_EmailNotificationView__WEBPACK_IMPORTED_MODULE_15__.EmailNotificationView, {}), tab === 'settings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_SettingsView__WEBPACK_IMPORTED_MODULE_13__.SettingsView, {}), tab === 'plugin-feedback' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_PluginFeedbackView__WEBPACK_IMPORTED_MODULE_16__.PluginFeedbackView, {}), tab === 'how-to-use' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_18__.jsx)(_views_HowToUseView__WEBPACK_IMPORTED_MODULE_17__.HowToUseView, {})]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/api.ts"
/*!*********************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/api.ts ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   approveFeedback: () => (/* binding */ approveFeedback),
/* harmony export */   bulkFeedback: () => (/* binding */ bulkFeedback),
/* harmony export */   exportCsv: () => (/* binding */ exportCsv),
/* harmony export */   fetchFeedback: () => (/* binding */ fetchFeedback),
/* harmony export */   fetchFeedbackDetail: () => (/* binding */ fetchFeedbackDetail),
/* harmony export */   fetchUsers: () => (/* binding */ fetchUsers),
/* harmony export */   getSettings: () => (/* binding */ getSettings),
/* harmony export */   patchFeedback: () => (/* binding */ patchFeedback),
/* harmony export */   postReply: () => (/* binding */ postReply),
/* harmony export */   reopenFeedback: () => (/* binding */ reopenFeedback),
/* harmony export */   saveSavedFilters: () => (/* binding */ saveSavedFilters),
/* harmony export */   sendPluginFeedback: () => (/* binding */ sendPluginFeedback),
/* harmony export */   sendTestDigest: () => (/* binding */ sendTestDigest),
/* harmony export */   setStatus: () => (/* binding */ setStatus)
/* harmony export */ });
/**
 * Thin REST helper for the admin dashboard. All calls send the WP nonce and
 * target the markaroo/v1 namespace off window.markarooConfig.restUrl.
 */

function base() {
  return window.markarooConfig.restUrl + 'markaroo/v1/';
}

/**
 * Join an endpoint path with a query string using the correct separator.
 * With plain permalinks the base is the `…?rest_route=/` form (already has a
 * `?`), so appending another `?` would break the route — use `&` instead.
 * @param path   Endpoint path relative to the markaroo/v1 base.
 * @param params Query parameters.
 */
function withParams(path, params) {
  const url = base() + path;
  const query = params.toString();
  if (!query) {
    return url;
  }
  return url + (url.includes('?') ? '&' : '?') + query;
}
function headers(json = true) {
  const h = {
    'X-WP-Nonce': window.markarooConfig.nonce
  };
  if (json) {
    h['Content-Type'] = 'application/json';
  }
  return h;
}
async function ok(res) {
  if (!res.ok) {
    throw new Error(String(res.status));
  }
  return await res.json();
}
function fetchFeedback(params) {
  return fetch(withParams('feedback', params), {
    headers: headers(false)
  }).then(r => ok(r));
}
function bulkFeedback(ids, changes) {
  return fetch(`${base()}feedback/bulk`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      ids,
      ...changes
    })
  }).then(r => ok(r));
}
function patchFeedback(id, changes) {
  return fetch(`${base()}feedback/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify(changes)
  }).then(r => ok(r));
}
function setStatus(id, status) {
  return fetch(`${base()}feedback/${id}/status`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      status
    })
  }).then(r => ok(r));
}

/**
 * Download the current filtered feedback list as a CSV file. Fetches as a Blob
 * (so the nonce header rides along) and triggers a browser save.
 * @param params
 */
async function exportCsv(params) {
  const res = await fetch(withParams('feedback/export', params), {
    headers: headers(false)
  });
  if (!res.ok) {
    throw new Error(String(res.status));
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `markaroo-feedback-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
function getSettings() {
  return fetch(`${base()}settings`, {
    headers: headers(false)
  }).then(r => ok(r));
}
function saveSavedFilters(savedFilters) {
  return fetch(`${base()}settings`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({
      saved_filters: savedFilters
    })
  }).then(r => ok(r));
}
function sendTestDigest() {
  return fetch(`${base()}notifications/test-digest`, {
    method: 'POST',
    headers: headers()
  }).then(r => ok(r));
}
function fetchFeedbackDetail(id) {
  return fetch(`${base()}feedback/${id}`, {
    headers: headers(false)
  }).then(r => ok(r));
}
let usersPromise = null;

/** Assignable users, fetched once per admin session. */
function fetchUsers() {
  if (!usersPromise) {
    usersPromise = fetch(`${base()}users`, {
      headers: headers(false)
    }).then(r => ok(r)).catch(err => {
      usersPromise = null; // allow retry on failure
      throw err;
    });
  }
  return usersPromise;
}
function approveFeedback(id) {
  return fetch(`${base()}feedback/${id}/approve`, {
    method: 'POST',
    headers: headers(),
    body: ''
  }).then(r => ok(r));
}
function reopenFeedback(id) {
  return fetch(`${base()}feedback/${id}/reopen`, {
    method: 'POST',
    headers: headers(),
    body: ''
  }).then(r => ok(r));
}
function postReply(feedbackId, comment) {
  const uuid = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `a-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return fetch(`${base()}feedback/${feedbackId}/replies`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      reply_uuid: uuid,
      comment
    })
  }).then(r => ok(r));
}
function sendPluginFeedback(payload) {
  return fetch(`${base()}plugin-feedback`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload)
  }).then(r => ok(r));
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/components/FeedbackDetailModal.tsx"
/*!*************************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/components/FeedbackDetailModal.tsx ***!
  \*************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FeedbackDetailModal: () => (/* binding */ FeedbackDetailModal)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/external-link.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/send.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var _widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../widget/support/renderMarkdown */ "./resources/assets/widget/support/renderMarkdown.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../api */ "./resources/assets/apps/dashboard-markaroo/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);






const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
const PRIORITIES = ['urgent', 'high', 'normal', 'low'];

// Sentence case: first letter upper, rest lower, underscores → spaces.
// ("in_progress" → "In progress", "high" → "High")
function sentenceCase(value) {
  const text = value.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}
function isImage(a) {
  return a.mime.startsWith('image/');
}
function FeedbackDetailModal({
  id,
  showApprovalActions,
  onClose,
  onChanged
}) {
  const config = window.markarooConfig;
  const canApprove = !!config.currentUser?.canApprove;
  const statusList = config.statusList ?? [{
    value: 'open',
    label: 'Open'
  }, {
    value: 'resolved',
    label: 'Resolved'
  }];
  const dialogRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [item, setItem] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [replies, setReplies] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [users, setUsers] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [busy, setBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [replyText, setReplyText] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_8__.fetchFeedbackDetail)(id).then(data => {
      setItem(data);
      setReplies(data.replies ?? []);
    }).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not load the feedback item.', 'markaroo'))).finally(() => setLoading(false));
    (0,_api__WEBPACK_IMPORTED_MODULE_8__.fetchUsers)().then(setUsers).catch(() => null);
  }, [id]);

  // Escape closes; body scroll locks while open.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);
  function applyUpdate(updated) {
    setItem(updated);
    onChanged(updated);
  }
  async function run(action) {
    setBusy(true);
    setError(null);
    try {
      applyUpdate(await action());
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Action failed. Please try again.', 'markaroo'));
    } finally {
      setBusy(false);
    }
  }

  // Optimistic field change: reflect the new value instantly (no disabled
  // flash, no value bounce), persist in the background, revert on failure.
  function optimistic(patch, action) {
    const prev = item;
    setItem(cur => cur ? {
      ...cur,
      ...patch
    } : cur);
    setError(null);
    action().then(fresh => applyUpdate(fresh)).catch(() => {
      setItem(prev);
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Action failed. Please try again.', 'markaroo'));
    });
  }
  async function submitReply(e) {
    e.preventDefault();
    if (!replyText.trim() || busy) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const reply = await (0,_api__WEBPACK_IMPORTED_MODULE_8__.postReply)(id, replyText.trim());
      setReplies(prev => [...prev, reply]);
      setReplyText('');
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not post the reply.', 'markaroo'));
    } finally {
      setBusy(false);
    }
  }
  const pageUrl = item?.page_url || (item ? config.restUrl.replace(/\/wp-json\/?$/, '') + item.page_key : '');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    className: "markaroo-detail-overlay",
    role: "presentation",
    onMouseDown: e => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      ref: dialogRef,
      className: "markaroo-detail",
      role: "dialog",
      "aria-modal": "true",
      "aria-label": `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feedback', 'markaroo')} #${id}`,
      tabIndex: -1,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-detail__head",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
          className: "markaroo-detail__id",
          children: ["#", id]
        }), item && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: "markaroo-admin-badge",
          style: {
            backgroundColor: PRIORITY_COLORS[item.priority] ?? '#9ca3af'
          },
          children: sentenceCase(item.priority)
        }), item && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
          className: `markaroo-admin-status markaroo-admin-status--${item.status}`,
          children: sentenceCase(item.status_label || item.status)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("button", {
          type: "button",
          className: "markaroo-detail__close",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'markaroo'),
          onClick: onClose,
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
            size: 18,
            strokeWidth: 2
          })
        })]
      }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "markaroo-admin__error-box",
        children: error
      }), loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("p", {
        className: "markaroo-admin__loading",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
      }), item && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
        className: "markaroo-detail__body",
        children: [item.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("h3", {
          className: "markaroo-detail__title",
          children: item.title
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-detail__meta",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            children: item.author
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            title: item.created_at,
            children: new Date(item.created_at).toLocaleString()
          }), pageUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("a", {
            className: "markaroo-detail__pagelink",
            href: pageUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
              size: 13,
              strokeWidth: 2
            }), item.page_key]
          })]
        }), item.comment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "markaroo-detail__comment",
          children: (0,_widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_7__.renderMarkdown)(item.comment)
        }), item.tags.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
          className: "markaroo-detail__tags",
          children: item.tags.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            className: "markaroo-detail__tag",
            children: t
          }, t))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-detail__controls",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
            htmlFor: "markaroo-detail-status",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Status', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("select", {
              id: "markaroo-detail-status",
              value: item.status,
              onChange: e => {
                const value = e.target.value;
                optimistic({
                  status: value
                }, () => (0,_api__WEBPACK_IMPORTED_MODULE_8__.setStatus)(id, value));
              },
              children: statusList.map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
                value: s.value,
                children: sentenceCase(s.label)
              }, s.value))
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
            htmlFor: "markaroo-detail-priority",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Priority', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("select", {
              id: "markaroo-detail-priority",
              value: item.priority,
              onChange: e => {
                const priority = e.target.value;
                optimistic({
                  priority
                }, () => (0,_api__WEBPACK_IMPORTED_MODULE_8__.patchFeedback)(id, {
                  priority
                }));
              },
              children: PRIORITIES.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
                value: p,
                children: sentenceCase(p)
              }, p))
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("label", {
            htmlFor: "markaroo-detail-assignee",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assignee', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("select", {
              id: "markaroo-detail-assignee",
              value: item.assigned_to_id,
              onChange: e => {
                const uid = Number(e.target.value);
                const name = users.find(u => u.id === uid)?.name ?? '';
                optimistic({
                  assigned_to_id: uid,
                  assigned_to_name: name
                }, () => (0,_api__WEBPACK_IMPORTED_MODULE_8__.patchFeedback)(id, {
                  assigned_to_id: uid,
                  assigned_to_name: name
                }));
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
                value: 0,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Unassigned', 'markaroo')
              }), users.map(u => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("option", {
                value: u.id,
                children: u.name
              }, u.id))]
            })]
          })]
        }), showApprovalActions && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-detail__approval",
          children: [canApprove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm",
            disabled: busy,
            onClick: () => run(() => (0,_api__WEBPACK_IMPORTED_MODULE_8__.approveFeedback)(id)),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
              size: 15,
              strokeWidth: 2
            }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approve', 'markaroo')]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
            disabled: busy,
            onClick: () => run(() => (0,_api__WEBPACK_IMPORTED_MODULE_8__.reopenFeedback)(id)),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
              size: 15,
              strokeWidth: 2
            }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reopen', 'markaroo')]
          })]
        }), item.screenshot_url && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-detail__section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            className: "markaroo-detail__label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Pinned content', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("a", {
            href: item.screenshot_url,
            target: "_blank",
            rel: "noopener noreferrer",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
              className: "markaroo-detail__shot",
              src: item.screenshot_url,
              alt: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Screenshot', 'markaroo'),
              loading: "lazy"
            })
          })]
        }), item.attachments.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-detail__section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
            className: "markaroo-detail__label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Attachments', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "markaroo-detail__attachments",
            children: item.attachments.map(a => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("a", {
              className: "markaroo-detail__attachment",
              href: a.url,
              target: "_blank",
              rel: "noopener noreferrer",
              children: [isImage(a) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("img", {
                src: a.url,
                alt: a.filename,
                loading: "lazy"
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                className: "markaroo-detail__attachment-badge",
                children: a.type_badge
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                className: "markaroo-detail__attachment-name",
                children: a.filename
              })]
            }, a.id))
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "markaroo-detail__section",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("span", {
            className: "markaroo-detail__label",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Replies', 'markaroo'), " (", replies.length, ")"]
          }), replies.map(r => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "markaroo-detail__reply",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
              className: "markaroo-detail__reply-meta",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("strong", {
                children: r.author
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("span", {
                title: r.created_at,
                children: new Date(r.created_at).toLocaleString()
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
              className: "markaroo-detail__reply-body",
              children: (0,_widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_7__.renderMarkdown)(r.comment)
            })]
          }, r.id)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("form", {
            className: "markaroo-detail__reply-form",
            onSubmit: submitReply,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("input", {
              type: "text",
              value: replyText,
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Write a reply…', 'markaroo'),
              "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reply', 'markaroo'),
              onChange: e => setReplyText(e.target.value)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("button", {
              type: "submit",
              className: "markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm",
              disabled: busy || !replyText.trim(),
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
                size: 15,
                strokeWidth: 2
              }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reply', 'markaroo')]
            })]
          })]
        })]
      })]
    })
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/ApprovalsView.tsx"
/*!**************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/ApprovalsView.tsx ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApprovalsView: () => (/* binding */ ApprovalsView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/check.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs");
/* harmony import */ var _components_FeedbackDetailModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/FeedbackDetailModal */ "./resources/assets/apps/dashboard-markaroo/components/FeedbackDetailModal.tsx");
/* harmony import */ var _widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../widget/support/renderMarkdown */ "./resources/assets/widget/support/renderMarkdown.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../api */ "./resources/assets/apps/dashboard-markaroo/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);







const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('just now', 'markaroo');
  }
  if (m < 60) {
    return `${m}m`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h}h`;
  }
  return `${Math.floor(h / 24)}d`;
}

/**
 * Approvals workflow. Lists resolved items awaiting sign-off using the same
 * table design as All Feedback, plus Approve/Reopen actions per row and in
 * the shared detail modal.
 */
function ApprovalsView() {
  const config = window.markarooConfig;
  const canApprove = !!config.currentUser?.canApprove;
  const [items, setItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [busyId, setBusyId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [detailId, setDetailId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setLoading(true);
    const params = new URLSearchParams({
      status: 'resolved',
      per_page: '50',
      order_by: 'updated_at',
      order: 'DESC'
    });
    (0,_api__WEBPACK_IMPORTED_MODULE_6__.fetchFeedback)(params).then(body => setItems(body.data ?? [])).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not load approvals.', 'markaroo'))).finally(() => setLoading(false));
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load();
  }, [load]);
  async function act(id, action) {
    setBusyId(id);
    setError(null);
    try {
      await (action === 'approve' ? (0,_api__WEBPACK_IMPORTED_MODULE_6__.approveFeedback)(id) : (0,_api__WEBPACK_IMPORTED_MODULE_6__.reopenFeedback)(id));
      // Either action removes the row from the "awaiting approval" list.
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Action failed. Please try again.', 'markaroo'));
    } finally {
      setBusyId(null);
    }
  }
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: "markaroo-admin-approvals",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approvals', 'markaroo')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "markaroo-getstarted__sub",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Resolved items awaiting sign-off.', 'markaroo')
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), !canApprove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('You can review these items, but only an approver can sign them off.', 'markaroo')
    }), items.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
      className: "markaroo-admin__empty",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nothing awaiting approval.', 'markaroo')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "markaroo-table-scroll",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("table", {
        className: "markaroo-admin-table markaroo-admin-tasklist__table",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("thead", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("tr", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('ID', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Comment', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Priority', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assignee', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Updated', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Page', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Actions', 'markaroo')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("tbody", {
          children: items.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("tr", {
            className: "markaroo-admin-table__row",
            onClick: () => setDetailId(item.id),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("td", {
              children: ["#", item.id]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("td", {
              className: "markaroo-admin-tasklist__title",
              children: item.title || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("em", {
                style: {
                  color: '#9ca3af'
                },
                children: "\u2014"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("td", {
              className: "markaroo-admin-tasklist__comment",
              children: (() => {
                const plain = (0,_widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_5__.stripMarkdown)(item.comment);
                return plain.length > 60 ? plain.slice(0, 60) + '…' : plain;
              })()
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
                className: "markaroo-admin-badge",
                style: {
                  backgroundColor: PRIORITY_COLORS[item.priority] ?? '#9ca3af'
                },
                children: item.priority
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("td", {
              children: item.assigned_to_name || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("em", {
                style: {
                  color: '#9ca3af'
                },
                children: "\u2014"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("td", {
              title: item.updated_at,
              children: timeAgo(item.updated_at)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("code", {
                className: "markaroo-admin-page-key",
                children: item.page_key
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("td", {
              className: "markaroo-admin-approvals__actions",
              onClick: e => e.stopPropagation(),
              children: [canApprove && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
                type: "button",
                className: "markaroo-admin-btn markaroo-admin-btn--primary markaroo-admin-btn--sm",
                disabled: busyId === item.id,
                onClick: () => act(item.id, 'approve'),
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
                  size: 15,
                  strokeWidth: 2
                }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Approve', 'markaroo')]
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("button", {
                type: "button",
                className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
                disabled: busyId === item.id,
                onClick: () => act(item.id, 'reopen'),
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
                  size: 15,
                  strokeWidth: 2
                }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reopen', 'markaroo')]
              })]
            })]
          }, item.id))
        })]
      })
    }), detailId !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_components_FeedbackDetailModal__WEBPACK_IMPORTED_MODULE_4__.FeedbackDetailModal, {
      id: detailId,
      showApprovalActions: true,
      onClose: () => setDetailId(null),
      onChanged: updated => {
        // Approving or reopening moves the item out of "resolved".
        if (updated && updated.status !== 'resolved') {
          setItems(prev => prev.filter(i => i.id !== updated.id));
        } else if (updated) {
          setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        } else {
          load();
        }
      }
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/EmailNotificationView.tsx"
/*!**********************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/EmailNotificationView.tsx ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EmailNotificationView: () => (/* binding */ EmailNotificationView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mail.mjs");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./resources/assets/apps/dashboard-markaroo/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





const DEFAULTS = {
  notify_mode: 'digest',
  digest_interval: 30,
  events: {
    mention: true,
    assignment: true
  }
};

/**
 * Dedicated Email Notification settings page. Maps onto the existing
 * `notifications` settings group: the enable checkbox is notify_mode !== 'off',
 * delivery mode is digest|smart, and instant alerts map to events.*.
 */
function EmailNotificationView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const [notif, setNotif] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(DEFAULTS);
  // Remember the mode to restore when re-enabling after "off".
  const [lastMode, setLastMode] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('digest');
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [saved, setSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [testing, setTesting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [testMsg, setTestMsg] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(restBase + 'settings', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(s => {
      const n = s.notifications ?? {};
      const mode = String(n.notify_mode ?? 'digest');
      setNotif({
        notify_mode: mode,
        digest_interval: Number(n.digest_interval ?? 30),
        events: {
          ...DEFAULTS.events,
          ...(n.events ?? {})
        }
      });
      if (mode !== 'off') {
        setLastMode(mode === 'instant' ? 'smart' : mode);
      }
    }).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not load settings.', 'markaroo'))).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const enabled = notif.notify_mode !== 'off';
  // Legacy 'instant' renders as Smart in the two-option select.
  const modeValue = notif.notify_mode === 'digest' ? 'digest' : 'smart';
  function update(changes) {
    setNotif(prev => ({
      ...prev,
      ...changes
    }));
  }
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(restBase + 'settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': config.nonce
        },
        body: JSON.stringify({
          notifications: notif
        })
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save failed.', 'markaroo'));
    } finally {
      setSaving(false);
    }
  }
  async function handleTest() {
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await (0,_api__WEBPACK_IMPORTED_MODULE_3__.sendTestDigest)();
      /* translators: %s: recipient email address. */
      setTestMsg(`${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Test email sent to', 'markaroo')} ${res.email}`);
    } catch {
      setTestMsg((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not send the test email.', 'markaroo'));
    } finally {
      setTesting(false);
      setTimeout(() => setTestMsg(null), 5000);
    }
  }
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "markaroo-admin-settings markaroo-admin-notifications",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email Notification', 'markaroo')
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), saved && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "markaroo-admin__success-box",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Settings saved.', 'markaroo')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
      onSubmit: handleSave,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Email Notifications', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          htmlFor: "markaroo-en-enable",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
            id: "markaroo-en-enable",
            type: "checkbox",
            checked: enabled,
            onChange: e => {
              if (e.target.checked) {
                update({
                  notify_mode: lastMode
                });
              } else {
                setLastMode(modeValue);
                update({
                  notify_mode: 'off'
                });
              }
            }
          }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Enable Visual Feedback email notifications', 'markaroo')]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "markaroo-settings-group__hint",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Uses low-spam delivery with digest by default.', 'markaroo')
        }), enabled && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("hr", {
            className: "markaroo-settings-divider"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h4", {
            className: "markaroo-settings-subhead",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delivery Mode', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
            htmlFor: "markaroo-en-mode",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Mode', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("select", {
              id: "markaroo-en-mode",
              value: modeValue,
              onChange: e => {
                update({
                  notify_mode: e.target.value
                });
                setLastMode(e.target.value);
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: "digest",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Digest only (recommended)', 'markaroo')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: "smart",
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Smart: Digest + instant assignment/mentions', 'markaroo')
              })]
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h4", {
            className: "markaroo-settings-subhead",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Digest Frequency', 'markaroo')
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
            htmlFor: "markaroo-en-interval",
            children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send a digest', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("select", {
              id: "markaroo-en-interval",
              value: notif.digest_interval,
              onChange: e => update({
                digest_interval: Number(e.target.value)
              }),
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: 15,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Every 15 minutes', 'markaroo')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: 30,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Every 30 minutes', 'markaroo')
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("option", {
                value: 60,
                children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Every 60 minutes', 'markaroo')
              })]
            })]
          }), modeValue === 'smart' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h4", {
              className: "markaroo-settings-subhead",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Instant Alerts (Smart mode)', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
              className: "markaroo-settings-toggle",
              htmlFor: "markaroo-en-assignment",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                id: "markaroo-en-assignment",
                type: "checkbox",
                checked: Boolean(notif.events.assignment),
                onChange: e => update({
                  events: {
                    ...notif.events,
                    assignment: e.target.checked
                  }
                })
              }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send instant emails for assignment changes', 'markaroo')]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
              className: "markaroo-settings-toggle",
              htmlFor: "markaroo-en-mention",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
                id: "markaroo-en-mention",
                type: "checkbox",
                checked: Boolean(notif.events.mention),
                onChange: e => update({
                  events: {
                    ...notif.events,
                    mention: e.target.checked
                  }
                })
              }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send instant emails when users are mentioned (@username)', 'markaroo')]
            })]
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send Test Email', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "markaroo-settings-group__hint",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send a sample notification email to the admin address to verify delivery is working.', 'markaroo')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
          className: "markaroo-settings-testdigest",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--ghost",
            onClick: handleTest,
            disabled: testing,
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
              size: 15,
              strokeWidth: 2
            }), testing ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sending…', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send test email', 'markaroo')]
          }), testMsg && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("span", {
            className: "markaroo-settings-testdigest__msg",
            children: testMsg
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "markaroo-settings-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("button", {
          type: "submit",
          className: "markaroo-admin-btn markaroo-admin-btn--primary",
          disabled: saving,
          children: saving ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Saving…', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Save settings', 'markaroo')
        })
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/HowToUseView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/HowToUseView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HowToUseView: () => (/* binding */ HowToUseView)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function sections() {
  return [{
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1. Getting started', 'markaroo'),
    steps: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Go to Settings and make sure "Allow feedback" is turned on. Choose whether the feedback button shows on the whole site or only on certain pages.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open your website. You will see a small "Feedback" button in the corner of the page.', 'markaroo')]
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('2. Leaving feedback (pins)', 'markaroo'),
    steps: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Click the Feedback button, then click "Pins" to start a feedback session.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Click anywhere on the page to drop a pin, or click and drag to select an area.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Give your feedback a short title. You can also write a longer comment, set a priority, and attach files or a screenshot.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Press the check button to save. Your pin now shows on the page.', 'markaroo')]
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('3. Replies and mentions', 'markaroo'),
    steps: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Click any pin to open it and read the conversation.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Write a reply at the bottom and press Enter to send it.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Type @ in a comment to mention a teammate. Mentioned people can get an email notification.', 'markaroo')]
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('4. Working with tasks', 'markaroo'),
    steps: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Every piece of feedback is also a task. In this dashboard, open "All Feedback" to see them all in one list.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Click any row to see the full details — screenshot, files, replies — and to change status, priority, or assignee.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use the "Board" page to move tasks between Open, In progress, Resolved, and Approved by dragging cards.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('When work is done, mark the feedback "Resolved". An approver can then sign it off on the "Approvals" page.', 'markaroo')]
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('5. Inviting clients (share links)', 'markaroo'),
    steps: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Your clients do not need a WordPress account. In Settings, find the "Guest Feedback Link" and copy it.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Send the link to your client. When they open it, they can view pins and leave their own feedback.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('If the link ever leaks, click "Regenerate" to make a new one — the old link stops working right away.', 'markaroo')]
  }, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('6. Email notifications', 'markaroo'),
    steps: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Open the "Email Notification" page to control emails. Digest mode sends a short summary every 15, 30, or 60 minutes instead of one email per event.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Smart mode also sends instant emails for important things: when someone is assigned or mentioned.', 'markaroo'), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Use "Send test email" to check that email delivery works on your site.', 'markaroo')]
  }];
}
function HowToUseView() {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-admin-howto",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('How to Use Markaroo', 'markaroo')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-getstarted__sub",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Markaroo lets your clients and team click on any page and leave feedback exactly where the problem is. Every comment becomes a task you can track here.', 'markaroo')
    }), sections().map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "markaroo-howto-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        className: "markaroo-howto-section__title",
        children: s.title
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("ol", {
        className: "markaroo-howto-section__steps",
        children: s.steps.map((step, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("li", {
          children: step
        }, i))
      })]
    }, s.title)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-howto-section markaroo-howto-section--footer",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("p", {
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Still stuck? We are happy to help —', 'markaroo'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
          href: "#plugin-feedback",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('send us a message', 'markaroo')
        }), "."]
      })
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/OverviewView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/OverviewView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OverviewView: () => (/* binding */ OverviewView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function StatCard({
  label,
  value,
  accent,
  href
}) {
  const body = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-stat-card__value",
      style: accent ? {
        color: accent
      } : undefined,
      children: value
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
      className: "markaroo-stat-card__label",
      children: label
    })]
  });
  if (href) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
      className: "markaroo-stat-card markaroo-stat-card--link",
      href: href,
      children: body
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
    className: "markaroo-stat-card",
    children: body
  });
}
function OverviewView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const [counts, setCounts] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(restBase + 'counts', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(setCounts).catch(() => setError('Could not load counts.')).finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: "Loading\u2026"
    });
  }
  if (error) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-admin__error",
      children: error
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-admin-overview",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: "Overview"
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
      className: "markaroo-stat-grid",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Total",
        value: counts?.total ?? 0,
        href: "#tasks?status="
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Open",
        value: counts?.open ?? 0,
        accent: "#6366f1",
        href: "#tasks?status=open"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Resolved",
        value: counts?.resolved ?? 0,
        accent: "#22c55e",
        href: "#tasks?status=resolved"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Today",
        value: counts?.today ?? 0,
        href: "#tasks?status="
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
        label: "Unassigned",
        value: counts?.unassigned ?? 0,
        href: "#tasks?status="
      })]
    }), (counts?.resolution_rate ?? 0) > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("p", {
      className: "markaroo-admin-rate",
      children: ["Resolution rate: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("strong", {
        children: [counts.resolution_rate, "%"]
      })]
    }), counts?.by_priority && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        className: "markaroo-admin__sub-title",
        children: "By Priority"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "markaroo-stat-grid",
        children: Object.entries(counts.by_priority).map(([k, v]) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(StatCard, {
          label: k.charAt(0).toUpperCase() + k.slice(1),
          value: v
        }, k))
      })]
    }), counts?.by_page && counts.by_page.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
        className: "markaroo-admin__sub-title",
        children: "Top Pages"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "markaroo-table-scroll",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("table", {
          className: "markaroo-admin-table",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
                children: "Page"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("th", {
                children: "Feedback count"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("tbody", {
            children: counts.by_page.slice(0, 10).map(row => {
              // page_key is a normalized path; prefix the site origin to get
              // the full, clickable URL.
              const siteUrl = config.restUrl.replace(/\/wp-json\/?$/, '');
              const fullUrl = siteUrl + row.page_key;
              return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("tr", {
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
                    className: "markaroo-admin-link",
                    href: fullUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    children: fullUrl
                  })
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("td", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("a", {
                    className: "markaroo-admin-link",
                    href: `#tasks?status=&page_key=${encodeURIComponent(row.page_key)}`,
                    children: row.count
                  })
                })]
              }, row.page_key);
            })
          })]
        })
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/PluginFeedbackView.tsx"
/*!*******************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/PluginFeedbackView.tsx ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginFeedbackView: () => (/* binding */ PluginFeedbackView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/send.mjs");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../api */ "./resources/assets/apps/dashboard-markaroo/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function PluginFeedbackView() {
  const me = window.markarooConfig.currentUser;
  const [name, setName] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(me?.name ?? '');
  const [email, setEmail] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [subject, setSubject] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [message, setMessage] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [sending, setSending] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [sent, setSent] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [emailError, setEmailError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!validEmail(email)) {
      setEmailError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please enter a valid email address.', 'markaroo'));
      return;
    }
    setEmailError(null);
    setSending(true);
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_3__.sendPluginFeedback)({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      });
      setSent(true);
      setSubject('');
      setMessage('');
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The message could not be sent. Please try again.', 'markaroo'));
    } finally {
      setSending(false);
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "markaroo-admin-settings markaroo-plugin-feedback",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send Plugin Feedback', 'markaroo')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "markaroo-getstarted__sub",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Share a bug report, feature request, or question with Native Infotech.', 'markaroo')
    }), sent && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "markaroo-admin__success-box",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Thanks! Your message has been sent.', 'markaroo')
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("form", {
      onSubmit: handleSubmit,
      className: "markaroo-settings-group",
      noValidate: true,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
        htmlFor: "markaroo-pf-name",
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your Name', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
          id: "markaroo-pf-name",
          type: "text",
          value: name,
          required: true,
          maxLength: 191,
          onChange: e => setName(e.target.value)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
        htmlFor: "markaroo-pf-email",
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Your Email', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
          id: "markaroo-pf-email",
          type: "email",
          value: email,
          required: true,
          maxLength: 191,
          onChange: e => setEmail(e.target.value)
        })]
      }), emailError && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "markaroo-field-error",
        children: emailError
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
        htmlFor: "markaroo-pf-subject",
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Subject', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("input", {
          id: "markaroo-pf-subject",
          type: "text",
          value: subject,
          required: true,
          maxLength: 191,
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Feature request, bug report, or question', 'markaroo'),
          onChange: e => setSubject(e.target.value)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("label", {
        htmlFor: "markaroo-pf-message",
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Message', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("textarea", {
          id: "markaroo-pf-message",
          rows: 8,
          value: message,
          required: true,
          onChange: e => setMessage(e.target.value)
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "markaroo-settings-group__hint",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This message will be emailed to hello@devemon.com along with your site URL and plugin version.', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "markaroo-settings-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("button", {
          type: "submit",
          className: "markaroo-admin-btn markaroo-admin-btn--primary",
          disabled: sending || !name.trim() || !email.trim() || !subject.trim() || !message.trim(),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
            size: 15,
            strokeWidth: 2
          }), sending ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Sending…', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Send Feedback', 'markaroo')]
        })
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/SettingsView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/SettingsView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SettingsView: () => (/* binding */ SettingsView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__);


function SettingsView() {
  const config = window.markarooConfig;
  const restBase = config.restUrl + 'markaroo/v1/';
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [saved, setSaved] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Page picker (loaded lazily when scope = 'pages').
  const [pages, setPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [pagesLoaded, setPagesLoaded] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);

  // Guest feedback link.
  const [guest, setGuest] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [regenerating, setRegenerating] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [copied, setCopied] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetch(restBase + 'settings', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(setSettings).catch(() => setError('Could not load settings.')).finally(() => setLoading(false));
    fetch(restBase + 'shares/guest-link', {
      headers: {
        'X-WP-Nonce': config.nonce
      }
    }).then(r => r.ok ? r.json() : Promise.reject(r.status)).then(setGuest).catch(() => null);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const g = settings.general ?? {};
  const scope = String(g.widget_scope ?? 'site');

  // Fetch published pages + posts once, when the page-scope picker is shown.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if ('pages' !== scope || pagesLoaded) {
      return;
    }
    setPagesLoaded(true);
    const headers = {
      'X-WP-Nonce': config.nonce
    };
    const fields = 'per_page=100&status=publish&_fields=id,title';
    Promise.all([fetch(`${config.restUrl}wp/v2/pages?${fields}`, {
      headers
    }).then(r => r.ok ? r.json() : []), fetch(`${config.restUrl}wp/v2/posts?${fields}`, {
      headers
    }).then(r => r.ok ? r.json() : [])]).then(([wpPages, wpPosts]) => {
      const toOption = p => ({
        id: p.id,
        title: p.title?.rendered || `#${p.id}`
      });
      const all = [...wpPages, ...wpPosts].map(toOption);
      all.sort((a, b) => a.title.localeCompare(b.title));
      setPages(all);
    }).catch(() => null);
  }, [scope, pagesLoaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function setField(group, key, value) {
    setSettings(prev => ({
      ...prev,
      [group]: {
        ...(prev[group] ?? {}),
        [key]: value
      }
    }));
  }
  async function handleSave(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(restBase + 'settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': config.nonce
        },
        body: JSON.stringify(settings)
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }
  function togglePage(id) {
    const current = Array.isArray(g.widget_pages) ? g.widget_pages : [];
    const next = current.includes(id) ? current.filter(pid => pid !== id) : [...current, id];
    setField('general', 'widget_pages', next);
  }
  function copyUrl(url) {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(done).catch(() => window.prompt('Copy this link:', url));
      return;
    }
    // Fallback for insecure (http://) dev contexts.
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch {
      window.prompt('Copy this link:', url);
    }
    document.body.removeChild(ta);
  }
  async function regenerate() {
    if (!window.confirm('Regenerate the guest link? The old link will stop working immediately.')) {
      return;
    }
    setRegenerating(true);
    try {
      const res = await fetch(restBase + 'shares/guest-link/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': config.nonce
        }
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      setGuest(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not regenerate link.');
    } finally {
      setRegenerating(false);
    }
  }
  if (loading) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
      className: "markaroo-admin__loading",
      children: "Loading\u2026"
    });
  }
  const c = settings.capture ?? {};
  const t = settings.tasks ?? {};
  const a = settings.access ?? {};
  const at = settings.attachments ?? {};
  const selectedPages = Array.isArray(g.widget_pages) ? g.widget_pages : [];
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
    className: "markaroo-admin-settings",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h2", {
      className: "markaroo-admin__section-title",
      children: "Settings"
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), saved && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
      className: "markaroo-admin__success-box",
      children: "Settings saved."
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("form", {
      onSubmit: handleSave,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Widget"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(g.widget_enabled ?? true),
            onChange: e => setField('general', 'widget_enabled', e.target.checked)
          }), "Allow feedback (show the widget on the front end)"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Where to show the widget", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: scope,
            onChange: e => setField('general', 'widget_scope', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "site",
              children: "Entire site"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "pages",
              children: "Specific pages"
            })]
          })]
        }), 'pages' === scope && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "markaroo-settings-pages",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("span", {
            className: "markaroo-settings-pages__label",
            children: "Pages with feedback enabled"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
            className: "markaroo-settings-pages__list",
            children: [pages.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
              className: "markaroo-admin__empty",
              children: "No published pages found."
            }), pages.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
              className: "markaroo-settings-toggle",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
                type: "checkbox",
                checked: selectedPages.includes(p.id),
                onChange: () => togglePage(p.id)
              }), p.title]
            }, p.id))]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Feedback button position", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: String(g.widget_position ?? 'bottom-right'),
            onChange: e => setField('general', 'widget_position', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "bottom-right",
              children: "Bottom right"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "bottom-left",
              children: "Bottom left"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(g.enable_screenshots ?? true),
            onChange: e => setField('general', 'enable_screenshots', e.target.checked)
          }), "Enable screenshots"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Screenshot format", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("select", {
            value: String(g.screenshot_format ?? 'jpeg'),
            onChange: e => setField('general', 'screenshot_format', e.target.value),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "jpeg",
              children: "JPEG (smaller files)"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("option", {
              value: "png",
              children: "PNG (lossless)"
            })]
          })]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Screenshot quality (", Math.round(Number(g.screenshot_quality ?? 0.8) * 100), "%)", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "range",
            min: "0.1",
            max: "1",
            step: "0.05",
            value: Number(g.screenshot_quality ?? 0.8),
            onChange: e => setField('general', 'screenshot_quality', Number(e.target.value))
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Capture"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(c.mask_inputs_in_screenshots ?? true),
            onChange: e => setField('capture', 'mask_inputs_in_screenshots', e.target.checked)
          }), "Mask form inputs in screenshots"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Tasks"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(t.enable_assignment ?? false),
            onChange: e => setField('tasks', 'enable_assignment', e.target.checked)
          }), "Enable task assignment"]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Guest Feedback Link"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          className: "markaroo-settings-toggle",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "checkbox",
            checked: Boolean(a.allow_guest_links ?? true),
            onChange: e => setField('access', 'allow_guest_links', e.target.checked)
          }), "Allow feedback from clients without WordPress accounts"]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("p", {
          className: "markaroo-settings-group__hint",
          children: "Anyone with the token link can view pins on the shared page and submit new feedback. Keep the link private."
        }), guest && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
          className: "markaroo-guest-link",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "text",
            readOnly: true,
            className: "markaroo-guest-link__url",
            value: guest.share_url,
            onFocus: e => e.target.select()
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
            onClick: () => copyUrl(guest.share_url),
            children: copied ? 'Copied!' : 'Copy URL'
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
            type: "button",
            className: "markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm",
            onClick: regenerate,
            disabled: regenerating,
            children: regenerating ? 'Regenerating…' : 'Regenerate'
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("div", {
        className: "markaroo-settings-group",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("h3", {
          className: "markaroo-settings-group__title",
          children: "Attachments"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsxs)("label", {
          children: ["Max upload size (MB)", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("input", {
            type: "number",
            min: "1",
            max: "50",
            value: Number(at.max_upload_mb ?? 5),
            onChange: e => setField('attachments', 'max_upload_mb', Number(e.target.value))
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("div", {
        className: "markaroo-settings-actions",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)("button", {
          type: "submit",
          className: "markaroo-admin-btn markaroo-admin-btn--primary",
          disabled: saving,
          children: saving ? 'Saving…' : 'Save settings'
        })
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/StatusBoardView.tsx"
/*!****************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/StatusBoardView.tsx ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StatusBoardView: () => (/* binding */ StatusBoardView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_FeedbackDetailModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/FeedbackDetailModal */ "./resources/assets/apps/dashboard-markaroo/components/FeedbackDetailModal.tsx");
/* harmony import */ var _widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../widget/support/renderMarkdown */ "./resources/assets/widget/support/renderMarkdown.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../api */ "./resources/assets/apps/dashboard-markaroo/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
const PER_COLUMN = 25;
function columns() {
  return window.markarooConfig.statusList ?? [{
    value: 'open',
    label: 'Open'
  }, {
    value: 'in_progress',
    label: 'In progress'
  }, {
    value: 'resolved',
    label: 'Resolved'
  }, {
    value: 'approved',
    label: 'Approved'
  }];
}
function cardTimeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('just now', 'markaroo');
  }
  if (m < 60) {
    return `${m}m`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h}h`;
  }
  return `${Math.floor(h / 24)}d`;
}
function Card({
  item,
  onDragStart,
  onOpen
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "markaroo-board-card",
    role: "button",
    tabIndex: 0,
    draggable: true,
    onDragStart: () => onDragStart(item.id, item.status),
    onClick: () => onOpen(item.id),
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpen(item.id);
      }
    },
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-board-card__top",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
        className: "markaroo-board-card__id",
        children: ["#", item.id]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "markaroo-admin-badge",
        style: {
          backgroundColor: PRIORITY_COLORS[item.priority] ?? '#9ca3af'
        },
        children: item.priority
      })]
    }), item.title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "markaroo-board-card__title",
      children: item.title
    }), item.comment && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "markaroo-board-card__comment",
      children: (() => {
        const plain = (0,_widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_3__.stripMarkdown)(item.comment);
        return plain.length > 100 ? plain.slice(0, 100) + '…' : plain;
      })()
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
      className: "markaroo-board-card__meta",
      children: [item.assigned_to_name && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "markaroo-board-card__assignee",
        children: item.assigned_to_name
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
        className: "markaroo-board-card__time",
        title: item.created_at,
        children: cardTimeAgo(item.created_at)
      })]
    })]
  });
}
function StatusBoardView() {
  const cols = columns();
  const [byStatus, setByStatus] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [dragOver, setDragOver] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [detailId, setDetailId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setLoading(true);
    setError(null);
    Promise.all(cols.map(c => {
      const params = new URLSearchParams();
      params.set('status', c.value);
      params.set('per_page', String(PER_COLUMN));
      params.set('page', '1');
      params.set('order_by', 'updated_at');
      params.set('order', 'DESC');
      return (0,_api__WEBPACK_IMPORTED_MODULE_4__.fetchFeedback)(params).then(body => [c.value, body.data ?? []]);
    })).then(pairs => {
      const map = {};
      pairs.forEach(([status, data]) => {
        map[status] = data;
      });
      setByStatus(map);
    }).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not load the board.', 'markaroo'))).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load();
  }, [load]);

  // Drag payload kept in a ref-like closure via state is fine here (single drag).
  const [dragging, setDragging] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  function onDragStart(id, from) {
    setDragging({
      id,
      from
    });
  }
  async function onDrop(to) {
    setDragOver(null);
    if (!dragging || dragging.from === to) {
      setDragging(null);
      return;
    }
    const {
      id,
      from
    } = dragging;
    setDragging(null);

    // Optimistic move.
    setByStatus(prev => {
      const source = prev[from] ?? [];
      const moved = source.find(i => i.id === id);
      if (!moved) {
        return prev;
      }
      const src = source.filter(i => i.id !== id);
      const target = [{
        ...moved,
        status: to
      }, ...(prev[to] ?? [])];
      return {
        ...prev,
        [from]: src,
        [to]: target
      };
    });
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_4__.setStatus)(id, to);
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not move the card.', 'markaroo'));
      load(); // revert to server truth
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "markaroo-board",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "markaroo-admin-tasklist__toolbar",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("h2", {
        className: "markaroo-admin__section-title",
        style: {
          margin: 0
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Status Board', 'markaroo')
      })
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "markaroo-board__columns",
      children: cols.map(c => {
        const list = byStatus[c.value] ?? [];
        return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: `markaroo-board__column${dragOver === c.value ? ' is-over' : ''}`,
          onDragOver: e => {
            e.preventDefault();
            setDragOver(c.value);
          },
          onDragLeave: () => setDragOver(prev => prev === c.value ? null : prev),
          onDrop: () => onDrop(c.value),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "markaroo-board__column-head",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              children: c.label
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
              className: "markaroo-board__column-count",
              children: list.length
            })]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            className: "markaroo-board__column-body",
            children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              className: "markaroo-board__loading",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
            }), !loading && list.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(Card, {
              item: item,
              onDragStart: onDragStart,
              onOpen: setDetailId
            }, item.id)), !loading && list.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              className: "markaroo-board__empty",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Nothing here.', 'markaroo')
            })]
          })]
        }, c.value);
      })
    }), detailId !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_components_FeedbackDetailModal__WEBPACK_IMPORTED_MODULE_2__.FeedbackDetailModal, {
      id: detailId,
      onClose: () => setDetailId(null),
      onChanged: updated => {
        if (!updated) {
          load();
          return;
        }
        // Status may have changed in the modal — move the card if needed.
        setByStatus(prev => {
          const next = {};
          Object.keys(prev).forEach(status => {
            next[status] = prev[status].filter(i => i.id !== updated.id);
          });
          next[updated.status] = [updated, ...(next[updated.status] ?? [])];
          return next;
        });
      }
    })]
  });
}

/***/ },

/***/ "./resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx"
/*!*************************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/views/TaskListView.tsx ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TaskListView: () => (/* binding */ TaskListView)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-down.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/arrow-up.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-left.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/chevron-right.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/download.mjs");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/x.mjs");
/* harmony import */ var _widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../widget/support/renderMarkdown */ "./resources/assets/widget/support/renderMarkdown.tsx");
/* harmony import */ var _components_FeedbackDetailModal__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/FeedbackDetailModal */ "./resources/assets/apps/dashboard-markaroo/components/FeedbackDetailModal.tsx");
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../api */ "./resources/assets/apps/dashboard-markaroo/api.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__);







const PRIORITIES = [{
  value: '',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All priorities', 'markaroo')
}, {
  value: 'urgent',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Urgent', 'markaroo')
}, {
  value: 'high',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('High', 'markaroo')
}, {
  value: 'normal',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Normal', 'markaroo')
}, {
  value: 'low',
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Low', 'markaroo')
}];
const PRIORITY_COLORS = {
  urgent: '#ef4444',
  high: '#f97316',
  normal: '#6366f1',
  low: '#9ca3af'
};
const DEFAULT_FILTERS = {
  status: 'open',
  priority: '',
  assignee: 0,
  tag: '',
  search: '',
  page_key: '',
  order_by: 'created_at',
  order: 'DESC',
  page: 1
};
function statusOptions() {
  const list = window.markarooConfig.statusList ?? [{
    value: 'open',
    label: 'Open'
  }, {
    value: 'resolved',
    label: 'Resolved'
  }];
  return [{
    value: '',
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All statuses', 'markaroo')
  }, ...list];
}
function availableTags() {
  const settings = window.markarooConfig.settings;
  return settings?.tasks?.available_tags ?? [];
}
function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(value);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) {
    return (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('just now', 'markaroo');
  }
  if (m < 60) {
    return `${m}m`;
  }
  const h = Math.floor(m / 60);
  if (h < 24) {
    return `${h}h`;
  }
  return `${Math.floor(h / 24)}d`;
}

/**
 * Plain-text, length-capped comment for a table cell.
 * @param comment Raw markdown comment.
 * @param max     Max characters before truncation.
 */
function commentPreview(comment, max = 60) {
  const plain = (0,_widget_support_renderMarkdown__WEBPACK_IMPORTED_MODULE_8__.stripMarkdown)(comment);
  return plain.length > max ? plain.slice(0, max) + '…' : plain;
}
function PriorityBadge({
  priority
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
    className: "markaroo-admin-badge",
    style: {
      backgroundColor: PRIORITY_COLORS[priority] ?? '#9ca3af'
    },
    children: priority
  });
}
function buildParams(filters, perPage) {
  const params = new URLSearchParams();
  if (filters.status) {
    params.set('status', filters.status);
  }
  if (filters.priority) {
    params.set('priority', filters.priority);
  }
  if (filters.assignee) {
    params.set('assigned_to', String(filters.assignee));
  }
  if (filters.tag) {
    params.set('tag', filters.tag);
  }
  if (filters.search) {
    params.set('search', filters.search);
  }
  if (filters.page_key) {
    params.set('page_key', filters.page_key);
  }
  params.set('order_by', filters.order_by);
  params.set('order', filters.order);
  params.set('per_page', String(perPage));
  params.set('page', String(filters.page));
  return params;
}
function TaskListView({
  initialStatus,
  initialPageKey
}) {
  const currentUserId = window.markarooConfig.currentUser?.id ?? 0;
  const currentUserName = window.markarooConfig.currentUser?.name ?? '';
  const [filters, setFilters] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => ({
    ...DEFAULT_FILTERS,
    ...(initialStatus !== undefined ? {
      status: initialStatus
    } : {}),
    ...(initialPageKey ? {
      page_key: initialPageKey
    } : {})
  }));
  const [detailId, setDetailId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [items, setItems] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [total, setTotal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(0);
  const [pages, setPages] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(1);
  const [loading, setLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selected, setSelected] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(() => new Set());
  const [busy, setBusy] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [exporting, setExporting] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [savedFilters, setSavedFilters] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [activeView, setActiveView] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('all');
  const debouncedSearch = useDebouncedValue(filters.search);
  const load = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    setLoading(true);
    setError(null);
    const params = buildParams({
      ...filters,
      search: debouncedSearch
    }, 25);
    (0,_api__WEBPACK_IMPORTED_MODULE_10__.fetchFeedback)(params).then(body => {
      setItems(body.data ?? []);
      setTotal(body.meta?.total ?? 0);
      setPages(body.meta?.pages ?? 1);
      setSelected(new Set());
    }).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not load feedback.', 'markaroo'))).finally(() => setLoading(false));
  }, [filters, debouncedSearch]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    load();
  }, [load]);

  // Load the current user's saved filters once.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_api__WEBPACK_IMPORTED_MODULE_10__.getSettings)().then(s => setSavedFilters(s.saved_filters ?? [])).catch(() => {
      /* non-fatal — saved filters are optional */
    });
  }, []);
  function setFilter(key, value) {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1
    }));
  }
  function toggleSort(col) {
    setFilters(prev => ({
      ...prev,
      order_by: col,
      order: prev.order_by === col && prev.order === 'DESC' ? 'ASC' : 'DESC',
      page: 1
    }));
  }

  // ---- Saved views / tabs -------------------------------------------------

  function applyView(view) {
    setActiveView(view);
    if (view === 'all') {
      setFilters({
        ...DEFAULT_FILTERS
      });
      return;
    }
    if (view === 'mine') {
      setFilters({
        ...DEFAULT_FILTERS,
        status: '',
        assignee: currentUserId
      });
      return;
    }
    const saved = savedFilters.find(f => f.name === view);
    if (saved) {
      setFilters({
        ...DEFAULT_FILTERS,
        status: saved.filters.status,
        priority: saved.filters.priority,
        assignee: saved.filters.assignee,
        tag: saved.filters.tag
      });
    }
  }
  function saveCurrentView() {
    // eslint-disable-next-line no-alert
    const name = window.prompt((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Name this filter view:', 'markaroo'));
    if (!name) {
      return;
    }
    const entry = {
      name,
      filters: {
        status: filters.status,
        priority: filters.priority,
        assignee: filters.assignee,
        tag: filters.tag
      }
    };
    const next = [...savedFilters.filter(f => f.name !== name), entry];
    setSavedFilters(next);
    setActiveView(name);
    (0,_api__WEBPACK_IMPORTED_MODULE_10__.saveSavedFilters)(next).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not save view.', 'markaroo')));
  }
  function deleteView(name) {
    const next = savedFilters.filter(f => f.name !== name);
    setSavedFilters(next);
    if (activeView === name) {
      applyView('all');
    }
    (0,_api__WEBPACK_IMPORTED_MODULE_10__.saveSavedFilters)(next).catch(() => setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Could not delete view.', 'markaroo')));
  }

  // ---- Selection ----------------------------------------------------------

  const allSelected = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => items.length > 0 && items.every(i => selected.has(i.id)), [items, selected]);
  function toggleAll() {
    setSelected(prev => {
      if (prev.size === items.length) {
        return new Set();
      }
      return new Set(items.map(i => i.id));
    });
  }
  function toggleOne(id) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // ---- Bulk actions -------------------------------------------------------

  async function runBulk(changes) {
    const ids = Array.from(selected);
    if (ids.length === 0) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_10__.bulkFeedback)(ids, changes);
      load();
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bulk action failed.', 'markaroo'));
    } finally {
      setBusy(false);
    }
  }
  function bulkDelete() {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete the selected feedback? This cannot be undone.', 'markaroo'));
    if (!confirmed) {
      return;
    }
    runBulk({
      delete: true
    });
  }
  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      await (0,_api__WEBPACK_IMPORTED_MODULE_10__.exportCsv)(buildParams({
        ...filters,
        search: debouncedSearch,
        page: 1
      }, 25));
    } catch {
      setError((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Export failed.', 'markaroo'));
    } finally {
      setExporting(false);
    }
  }
  function SortButton({
    col,
    label
  }) {
    const active = filters.order_by === col;
    function arrow() {
      if (!active) {
        return null;
      }
      return filters.order === 'DESC' ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
        size: 13,
        strokeWidth: 2
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
        size: 13,
        strokeWidth: 2
      });
    }
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button", {
      type: "button",
      className: `markaroo-admin-sort${active ? ' markaroo-admin-sort--active' : ''}`,
      onClick: () => toggleSort(col),
      children: [label, arrow()]
    });
  }
  const frontUrl = window.markarooConfig.restUrl.replace('/wp-json/', '/');
  const tags = availableTags();
  const selectedCount = selected.size;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
    className: "markaroo-admin-tasklist",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-admin-tasklist__toolbar",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("h2", {
        className: "markaroo-admin__section-title",
        style: {
          margin: 0
        },
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All Feedback', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
        className: "markaroo-admin-tasklist__filters",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("select", {
          value: filters.status,
          onChange: e => setFilter('status', e.target.value),
          children: statusOptions().map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: s.value,
            children: s.label
          }, s.value))
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("select", {
          value: filters.priority,
          onChange: e => setFilter('priority', e.target.value),
          children: PRIORITIES.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: p.value,
            children: p.label
          }, p.value))
        }), tags.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select", {
          value: filters.tag,
          onChange: e => setFilter('tag', e.target.value),
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: "",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All tags', 'markaroo')
          }), tags.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
            value: t,
            children: t
          }, t))]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
          type: "search",
          placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Search…', 'markaroo'),
          value: filters.search,
          onChange: e => setFilter('search', e.target.value),
          className: "markaroo-admin-tasklist__search"
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button", {
          type: "button",
          className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
          onClick: handleExport,
          disabled: exporting,
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
            size: 14,
            strokeWidth: 2
          }), exporting ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Exporting…', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Export CSV', 'markaroo')]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
          className: "markaroo-admin-tasklist__count",
          children: loading ? '…' : /* translators: %d: number of review items. */
          `${total} ${total !== 1 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('items', 'markaroo') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('item', 'markaroo')}`
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-admin-tasklist__views",
      role: "tablist",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        type: "button",
        className: `markaroo-admin-view-tab${activeView === 'all' ? ' is-active' : ''}`,
        onClick: () => applyView('all'),
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('All', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        type: "button",
        className: `markaroo-admin-view-tab${activeView === 'mine' ? ' is-active' : ''}`,
        onClick: () => applyView('mine'),
        title: currentUserName,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assigned to me', 'markaroo')
      }), savedFilters.map(f => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
        className: "markaroo-admin-view-tab-wrap",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          type: "button",
          className: `markaroo-admin-view-tab${activeView === f.name ? ' is-active' : ''}`,
          onClick: () => applyView(f.name),
          children: f.name
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
          type: "button",
          className: "markaroo-admin-view-tab__remove",
          "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete view', 'markaroo'),
          onClick: () => deleteView(f.name),
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], {
            size: 13,
            strokeWidth: 2
          })
        })]
      }, f.name)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        type: "button",
        className: "markaroo-admin-view-tab markaroo-admin-view-tab--add",
        onClick: saveCurrentView,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('+ Save view', 'markaroo')
      })]
    }), selectedCount > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-admin-bulkbar",
      role: "region",
      "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Bulk actions', 'markaroo'),
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
        className: "markaroo-admin-bulkbar__count",
        children: `${selectedCount} ${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('selected', 'markaroo')}`
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select", {
        defaultValue: "",
        disabled: busy,
        onChange: e => {
          if (e.target.value) {
            runBulk({
              status: e.target.value
            });
            e.target.value = '';
          }
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
          value: "",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set status…', 'markaroo')
        }), (window.markarooConfig.statusList ?? []).map(s => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
          value: s.value,
          children: s.label
        }, s.value))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select", {
        defaultValue: "",
        disabled: busy,
        onChange: e => {
          if (e.target.value) {
            runBulk({
              priority: e.target.value
            });
            e.target.value = '';
          }
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
          value: "",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set priority…', 'markaroo')
        }), PRIORITIES.filter(p => p.value).map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
          value: p.value,
          children: p.label
        }, p.value))]
      }), tags.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("select", {
        defaultValue: "",
        disabled: busy,
        onChange: e => {
          if (e.target.value) {
            runBulk({
              tags: [e.target.value]
            });
            e.target.value = '';
          }
        },
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
          value: "",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Set tag…', 'markaroo')
        }), tags.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("option", {
          value: t,
          children: t
        }, t))]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
        disabled: busy || !currentUserId,
        onClick: () => runBulk({
          assigned_to_id: currentUserId,
          assigned_to_name: currentUserName
        }),
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assign to me', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--danger markaroo-admin-btn--sm",
        disabled: busy,
        onClick: bulkDelete,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delete', 'markaroo')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
        onClick: () => setSelected(new Set()),
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Clear', 'markaroo')
      })]
    }), error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "markaroo-admin__error-box",
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("div", {
      className: "markaroo-table-scroll",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("table", {
        className: "markaroo-admin-table markaroo-admin-tasklist__table",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("thead", {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              className: "markaroo-admin-table__check",
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
                type: "checkbox",
                checked: allSelected,
                onChange: toggleAll,
                "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select all', 'markaroo')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(SortButton, {
                col: "created_at",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('ID', 'markaroo')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Comment', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(SortButton, {
                col: "status",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Status', 'markaroo')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(SortButton, {
                col: "priority",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Priority', 'markaroo')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Assignee', 'markaroo')
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(SortButton, {
                col: "created_at",
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Created', 'markaroo')
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("th", {
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Page', 'markaroo')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tbody", {
          children: [loading && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tr", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              colSpan: 9,
              className: "markaroo-admin-tasklist__loading-row",
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Loading…', 'markaroo')
            })
          }), !loading && items.length === 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("tr", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              colSpan: 9,
              className: "markaroo-admin__empty",
              style: {
                padding: '20px',
                textAlign: 'center'
              },
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No feedback found.', 'markaroo')
            })
          }), items.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("tr", {
            className: `markaroo-admin-table__row${selected.has(item.id) ? ' is-selected' : ''}`,
            onClick: () => setDetailId(item.id),
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              className: "markaroo-admin-table__check",
              onClick: e => e.stopPropagation(),
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("input", {
                type: "checkbox",
                checked: selected.has(item.id),
                onChange: () => toggleOne(item.id),
                "aria-label": `${(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select feedback', 'markaroo')} #${item.id}`
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              onClick: e => e.stopPropagation(),
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("a", {
                href: `${frontUrl.replace(/\/$/, '')}${item.page_key}?markaroo_open=${item.id}`,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "markaroo-admin-link",
                title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Open on the page', 'markaroo'),
                children: ["#", item.id]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              className: "markaroo-admin-tasklist__title",
              children: item.title || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("em", {
                style: {
                  color: '#9ca3af'
                },
                children: "\u2014"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              className: "markaroo-admin-tasklist__comment",
              children: commentPreview(item.comment)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("span", {
                className: `markaroo-admin-status markaroo-admin-status--${item.status}`,
                children: item.status_label || item.status
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(PriorityBadge, {
                priority: item.priority
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              children: item.assigned_to_name || /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("em", {
                style: {
                  color: '#9ca3af'
                },
                children: "\u2014"
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              title: item.created_at,
              children: timeAgo(item.created_at)
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("td", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)("code", {
                className: "markaroo-admin-page-key",
                children: item.page_key
              })
            })]
          }, item.id))]
        })]
      })
    }), detailId !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(_components_FeedbackDetailModal__WEBPACK_IMPORTED_MODULE_9__.FeedbackDetailModal, {
      id: detailId,
      onClose: () => setDetailId(null),
      onChanged: updated => {
        if (updated) {
          setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        } else {
          load();
        }
      }
    }), pages > 1 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      className: "markaroo-admin-pagination",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
        disabled: filters.page <= 1,
        onClick: () => setFilter('page', filters.page - 1),
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
          size: 15,
          strokeWidth: 2
        }), (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Prev', 'markaroo')]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("span", {
        children: [filters.page, " / ", pages]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("button", {
        type: "button",
        className: "markaroo-admin-btn markaroo-admin-btn--ghost markaroo-admin-btn--sm",
        disabled: filters.page >= pages,
        onClick: () => setFilter('page', filters.page + 1),
        children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Next', 'markaroo'), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
          size: 15,
          strokeWidth: 2
        })]
      })]
    })]
  });
}

/***/ },

/***/ "./resources/assets/widget/support/renderMarkdown.tsx"
/*!************************************************************!*\
  !*** ./resources/assets/widget/support/renderMarkdown.tsx ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseInline: () => (/* binding */ parseInline),
/* harmony export */   renderMarkdown: () => (/* binding */ renderMarkdown),
/* harmony export */   stripMarkdown: () => (/* binding */ stripMarkdown)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);

// Only these schemes are honored for links; anything else renders as literal
// text so a `[x](javascript:…)` can never become a live href.
const SAFE_URL = /^(https?:|mailto:)/i;

/**
 * Parse the inline markdown the composer toolbar emits — `code`, **bold**,
 * *italic*, [text](url) — into React nodes. Plain runs stay as strings, which
 * React escapes, so untrusted input can never inject markup.
 *
 * Exported for the unit test; prefer renderMarkdown() in components.
 * @param text    One line of markdown.
 * @param keyBase Stable key prefix for the produced elements.
 */
function parseInline(text, keyBase) {
  const nodes = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let i = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    const key = `${keyBase}-${i++}`;
    if (m[1] !== undefined) {
      nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('code', {
        key
      }, m[1]));
    } else if (m[2] !== undefined) {
      nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('strong', {
        key
      }, m[2]));
    } else if (m[3] !== undefined) {
      nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('em', {
        key
      }, m[3]));
    } else {
      const url = (m[5] ?? '').trim();
      if (SAFE_URL.test(url)) {
        nodes.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('a', {
          key,
          href: url,
          target: '_blank',
          rel: 'noopener noreferrer'
        }, m[4]));
      } else {
        nodes.push(m[0]); // Unsafe scheme → literal text.
      }
    }
    last = re.lastIndex;
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }
  return nodes;
}

/**
 * Strip the markdown the toolbar emits down to readable plain text — for
 * compact previews (table cells, board cards) where rendered formatting would
 * be noise. Not for security; use renderMarkdown() for actual display.
 * @param text The stored comment text.
 */
function stripMarkdown(text) {
  return (text || '').replace(/`([^`]+)`/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/^\s*[-*]\s+/gm, '').replace(/^\s*\d+\.\s+/gm, '').replace(/\s+/g, ' ').trim();
}

/**
 * Render a safe subset of markdown (bold/italic/code/link + `-`/`1.` lists) as
 * React nodes. ponytail: line-based block parse — good enough for the toolbar's
 * own output; swap for a real parser only if nested markdown is ever needed.
 * @param text The stored comment/reply text.
 */
function renderMarkdown(text) {
  if (!text) {
    return null;
  }
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let para = [];
  let list = null;
  let b = 0;
  const flushPara = () => {
    if (!para.length) {
      return;
    }
    const key = `p-${b++}`;
    const kids = [];
    para.forEach((ln, idx) => {
      if (idx > 0) {
        kids.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('br', {
          key: `br-${key}-${idx}`
        }));
      }
      kids.push(...parseInline(ln, `${key}-${idx}`));
    });
    blocks.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
      key,
      className: 'markaroo-md__p'
    }, ...kids));
    para = [];
  };
  const flushList = () => {
    if (!list) {
      return;
    }
    const key = `l-${b++}`;
    const tag = list.ordered ? 'ol' : 'ul';
    const items = list.items.map((it, idx) => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
      key: `${key}-${idx}`
    }, ...parseInline(it, `${key}-${idx}`)));
    blocks.push((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, {
      key,
      className: 'markaroo-md__list'
    }, ...items));
    list = null;
  };
  for (const line of lines) {
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ol) {
      flushPara();
      if (!list || !list.ordered) {
        flushList();
        list = {
          ordered: true,
          items: []
        };
      }
      list.items.push(ol[1]);
    } else if (ul) {
      flushPara();
      if (!list || list.ordered) {
        flushList();
        list = {
          ordered: false,
          items: []
        };
      }
      list.items.push(ul[1]);
    } else if (line.trim() === '') {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line);
    }
  }
  flushPara();
  flushList();
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ...blocks);
}

/***/ },

/***/ "react"
/*!************************!*\
  !*** external "React" ***!
  \************************/
(module) {

module.exports = window["React"];

/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "./node_modules/lucide-react/dist/esm/Icon.mjs"
/*!*****************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/Icon.mjs ***!
  \*****************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultAttributes.mjs */ "./node_modules/lucide-react/dist/esm/defaultAttributes.mjs");
/* harmony import */ var _shared_src_utils_hasA11yProp_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils/hasA11yProp.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs");
/* harmony import */ var _shared_src_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/src/utils/mergeClasses.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs");
/* harmony import */ var _context_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context.mjs */ "./node_modules/lucide-react/dist/esm/context.mjs");

"use client";
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */







const Icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = (0,_context_mjs__WEBPACK_IMPORTED_MODULE_4__.useLucideContext)() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
      "svg",
      {
        ref,
        ..._defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_1__["default"],
        width: size ?? contextSize ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].width,
        height: size ?? contextSize ?? _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_1__["default"].height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: (0,_shared_src_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_3__.mergeClasses)("lucide", contextClass, className),
        ...!children && !(0,_shared_src_utils_hasA11yProp_mjs__WEBPACK_IMPORTED_MODULE_2__.hasA11yProp)(rest) && { "aria-hidden": "true" },
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);


//# sourceMappingURL=Icon.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/context.mjs"
/*!********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/context.mjs ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LucideProvider: () => (/* binding */ LucideProvider),
/* harmony export */   useLucideContext: () => (/* binding */ useLucideContext)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");

"use client";
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const LucideContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});
function LucideProvider({
  children,
  size,
  color,
  strokeWidth,
  absoluteStrokeWidth,
  className
}) {
  const value = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(
    () => ({
      size,
      color,
      strokeWidth,
      absoluteStrokeWidth,
      className
    }),
    [size, color, strokeWidth, absoluteStrokeWidth, className]
  );
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(LucideContext.Provider, { value }, children);
}
const useLucideContext = () => (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(LucideContext);


//# sourceMappingURL=context.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _shared_src_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/src/utils/mergeClasses.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs");
/* harmony import */ var _shared_src_utils_toKebabCase_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils/toKebabCase.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs");
/* harmony import */ var _shared_src_utils_toPascalCase_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/src/utils/toPascalCase.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs");
/* harmony import */ var _Icon_mjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Icon.mjs */ "./node_modules/lucide-react/dist/esm/Icon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */







const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
    ({ className, ...props }, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Icon_mjs__WEBPACK_IMPORTED_MODULE_4__["default"], {
      ref,
      iconNode,
      className: (0,_shared_src_utils_mergeClasses_mjs__WEBPACK_IMPORTED_MODULE_1__.mergeClasses)(
        `lucide-${(0,_shared_src_utils_toKebabCase_mjs__WEBPACK_IMPORTED_MODULE_2__.toKebabCase)((0,_shared_src_utils_toPascalCase_mjs__WEBPACK_IMPORTED_MODULE_3__.toPascalCase)(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = (0,_shared_src_utils_toPascalCase_mjs__WEBPACK_IMPORTED_MODULE_3__.toPascalCase)(iconName);
  return Component;
};


//# sourceMappingURL=createLucideIcon.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/defaultAttributes.mjs"
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/defaultAttributes.mjs ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/arrow-down.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/arrow-down.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ArrowDown)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M12 5v14", key: "s699le" }],
  ["path", { d: "m19 12-7 7-7-7", key: "1idqje" }]
];
const ArrowDown = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("arrow-down", __iconNode);


//# sourceMappingURL=arrow-down.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/arrow-up.mjs"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/arrow-up.mjs ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ArrowUp)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
];
const ArrowUp = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("arrow-up", __iconNode);


//# sourceMappingURL=arrow-up.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/badge-check.mjs"
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/badge-check.mjs ***!
  \******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ BadgeCheck)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
      key: "3c2336"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const BadgeCheck = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("badge-check", __iconNode);


//# sourceMappingURL=badge-check.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/book-open.mjs"
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/book-open.mjs ***!
  \****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ BookOpen)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("book-open", __iconNode);


//# sourceMappingURL=book-open.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/check.mjs"
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/check.mjs ***!
  \************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ Check)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]];
const Check = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("check", __iconNode);


//# sourceMappingURL=check.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/chevron-left.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chevron-left.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ChevronLeft)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("chevron-left", __iconNode);


//# sourceMappingURL=chevron-left.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/chevron-right.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/chevron-right.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ChevronRight)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("chevron-right", __iconNode);


//# sourceMappingURL=chevron-right.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/download.mjs"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/download.mjs ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ Download)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("download", __iconNode);


//# sourceMappingURL=download.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/external-link.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/external-link.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ ExternalLink)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("external-link", __iconNode);


//# sourceMappingURL=external-link.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ LayoutDashboard)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }]
];
const LayoutDashboard = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("layout-dashboard", __iconNode);


//# sourceMappingURL=layout-dashboard.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/mail.mjs"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/mail.mjs ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ Mail)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("mail", __iconNode);


//# sourceMappingURL=mail.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/messages-square.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/messages-square.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ MessagesSquare)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
      key: "1n2ejm"
    }
  ],
  [
    "path",
    {
      d: "M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1",
      key: "1qfcsi"
    }
  ]
];
const MessagesSquare = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("messages-square", __iconNode);


//# sourceMappingURL=messages-square.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs"
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs ***!
  \*****************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ RotateCcw)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("rotate-ccw", __iconNode);


//# sourceMappingURL=rotate-ccw.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/send.mjs"
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/send.mjs ***!
  \***********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ Send)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("send", __iconNode);


//# sourceMappingURL=send.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/settings.mjs"
/*!***************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/settings.mjs ***!
  \***************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ Settings)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("settings", __iconNode);


//# sourceMappingURL=settings.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/square-kanban.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/square-kanban.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ SquareKanban)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M8 7v7", key: "1x2jlm" }],
  ["path", { d: "M12 7v4", key: "xawao1" }],
  ["path", { d: "M16 7v9", key: "1hp2iy" }]
];
const SquareKanban = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("square-kanban", __iconNode);


//# sourceMappingURL=square-kanban.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/icons/x.mjs"
/*!********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/x.mjs ***!
  \********************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ X)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const __iconNode = [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
];
const X = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("x", __iconNode);


//# sourceMappingURL=x.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   hasA11yProp: () => (/* binding */ hasA11yProp)
/* harmony export */ });
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};


//# sourceMappingURL=hasA11yProp.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs"
/*!******************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeClasses: () => (/* binding */ mergeClasses)
/* harmony export */ });
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();


//# sourceMappingURL=mergeClasses.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toCamelCase: () => (/* binding */ toCamelCase)
/* harmony export */ });
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);


//# sourceMappingURL=toCamelCase.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs"
/*!*****************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs ***!
  \*****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();


//# sourceMappingURL=toKebabCase.mjs.map


/***/ },

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs"
/*!******************************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs ***!
  \******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toPascalCase: () => (/* binding */ toPascalCase)
/* harmony export */ });
/* harmony import */ var _toCamelCase_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toCamelCase.mjs */ "./node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs");
/**
 * @license lucide-react v1.25.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const toPascalCase = (string) => {
  const camelCase = (0,_toCamelCase_mjs__WEBPACK_IMPORTED_MODULE_0__.toCamelCase)(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};


//# sourceMappingURL=toPascalCase.mjs.map


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/apps/dashboard-markaroo/index.tsx ***!
  \************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AdminShell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AdminShell */ "./resources/assets/apps/dashboard-markaroo/AdminShell.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const container = document.getElementById('dashboard-markaroo-root');
if (container) {
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(container).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_AdminShell__WEBPACK_IMPORTED_MODULE_1__.AdminShell, {}));
}
})();

/******/ })()
;
//# sourceMappingURL=dashboard-markaroo.js.map