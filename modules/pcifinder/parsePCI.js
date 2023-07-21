let cache = new Map()

async function parsePCI() {
    if (cache.size === 0) {
		const vendors = new Map()
		const response = await fetch("https://raw.githubusercontent.com/pciutils/pciids/master/pci.ids")
		const raw = await response.text()
		let nc = ""
		for (const l of raw.split("\n")) {
			if (l.startsWith("#")) {
				continue
			}
			nc += l + "\n"
		}
		const sp = nc.split("\n")
        let currentVendor;
        let currentDevice;
        let i = 0;
		for (const l of sp){
			if (!l.startsWith("\t")) {
				if (sp.length > i+1 && !sp[i+1].startsWith("\t")) {
					continue
				}
				const ext = l.trim().split("  ")
				if (ext.length < 2) {
					continue
				}
				currentVendor = {
					ID:      ext[0],
					Name:    ext[1],
					Devices: new Map()
				}
                vendors.set(ext[0], currentVendor)
			} else {
				if (!l.startsWith("\t\t")) {
					const ext = l.trim().split("  ")
					if (ext.length < 2) {
						continue
					}
                    if (!currentVendor) {
                        continue
                    }
                    currentVendor.Devices.set(ext[0], {
						ID:      ext[0],
						Name:    ext[1],
						Devices: new Map(),
					})
					if (sp.length > i+1 && sp[i+1].startsWith("\t\t")) {
						currentDevice = currentVendor.Devices[ext[0]]
					}
				}
			}
            i+=1
		}
		cache = vendors
	}
	return cache
}

module.exports = {
    parsePCI,
}