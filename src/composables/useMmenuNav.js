import { watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import Mmenu from 'mmenu-js';

/**
 * Off-canvas mobil menü (mmenu.js). A desktop sor a Bootstrap navbarban marad (d-lg-flex).
 * @param {{ menuElRef: import('vue').Ref; isDark: import('vue').Ref<boolean>; togglerRef?: import('vue').Ref }} opts
 */
export function useMmenuNav({ menuElRef, isDark, togglerRef }) {
  let mmenuInstance = null;

  function destroy() {
    if (!mmenuInstance) return;
    try {
      mmenuInstance.close();
    } catch (_) {
      /* ignore */
    }
    const m = mmenuInstance;
    const menuEl = m.node.menu;
    const wrpr = m.node.wrpr;
    if (menuEl?.parentNode) {
      menuEl.remove();
    }
    if (wrpr) {
      [...wrpr.classList]
        .filter((c) => c.startsWith('mm-wrapper'))
        .forEach((c) => wrpr.classList.remove(c));
    }
    if (Mmenu.node.page) {
      Mmenu.node.page.classList.remove('mm-page', 'mm-slideout');
      Mmenu.node.page.removeAttribute('inert');
    }
    if (Mmenu.node.blck) {
      Mmenu.node.blck.remove();
      Mmenu.node.blck = null;
    }
    Mmenu.node.page = null;
    mmenuInstance = null;
    resetHorizontalScroll();
    window.setTimeout(resetHorizontalScroll, 0);
  }

  function resetHorizontalScroll() {
    if (typeof document === 'undefined') return;
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    const app = document.getElementById('app');
    if (app) {
      app.scrollLeft = 0;
    }
  }

  /**
   * Bezárás után néha megmarad vízszintes offset (transform/scroll). Többszöri reset + átmenet végére időzítés.
   */
  function bindPageStability() {
    if (!mmenuInstance) return;
    const scheduleReset = () => {
      resetHorizontalScroll();
      requestAnimationFrame(() => {
        resetHorizontalScroll();
        requestAnimationFrame(resetHorizontalScroll);
      });
      window.setTimeout(resetHorizontalScroll, 50);
      window.setTimeout(resetHorizontalScroll, 420);
    };

    mmenuInstance.bind('close:after', scheduleReset);
    mmenuInstance.bind('open:after', () => {
      resetHorizontalScroll();
    });
  }

  function bindTogglerAria() {
    if (!mmenuInstance || !togglerRef?.value) return;
    const toggle = togglerRef.value;
    mmenuInstance.bind('open:after', () => {
      toggle.setAttribute('aria-expanded', 'true');
    });
    mmenuInstance.bind('close:after', () => {
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function mount() {
    const el = menuElRef.value;
    if (!el || typeof window === 'undefined') return;

    mmenuInstance = new Mmenu(
      el,
      {
        offCanvas: { position: 'left', use: true },
        scrollBugFix: { fix: true },
        theme: isDark.value ? 'dark' : 'light',
        navbars: [{ position: 'top', content: ['close'] }],
      },
      {
        offCanvas: {
          page: { selector: '#app' },
        },
      },
    );
    bindPageStability();
    bindTogglerAria();
  }

  watch(isDark, (dark) => {
    if (mmenuInstance?.API?.theme) {
      mmenuInstance.API.theme(dark ? 'dark' : 'light');
    }
  });

  onMounted(() => {
    nextTick(() => {
      mount();
    });
  });

  onBeforeUnmount(() => {
    destroy();
  });

  function open() {
    mmenuInstance?.API?.open();
  }

  function close() {
    mmenuInstance?.API?.close();
  }

  function isOpen() {
    return !!mmenuInstance?.node?.menu?.matches?.('.mm-menu--opened');
  }

  return { open, close, isOpen };
}
