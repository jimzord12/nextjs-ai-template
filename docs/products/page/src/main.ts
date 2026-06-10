import { setBasePath, allDefined } from '@awesome.me/webawesome/dist/webawesome.js'
import './wa.js'

// Required: tells WA where to find icon/asset files
setBasePath('/assets/webawesome')

// Wait for all wa-* elements to register before removing cloak
await allDefined()

// Remove FOUCE cloak
document.documentElement.classList.remove('wa-cloak')
