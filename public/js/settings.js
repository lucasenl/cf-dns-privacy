$(function () {
	let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	$("div#settingsModal button#addAccount").click((event) => {
		if ($('div#settingsModal div#account-id').length) {
			// New account already added
		} else {
			// Create new account tab
			$(`<button class="nav-link active" id="account-id-tab" data-bs-toggle="pill" data-bs-target="#account-id" type="button" role="tab" aria-controls="account-id" aria-selected="true" title="Account ID#">Account Name</button>`).insertBefore("div#settingsModal button#addAccount");

			const newForm = $(`<div class="tab-pane fade show active" id="account-id" role="tabpanel" aria-labelledby="account-id-tab">
				<form onsubmit="return false;">
					<div class="form-group mb-3">
						<label for="account-id-id" class="col-form-label">Account ID:</label>
						<input type="text" class="form-control" id="account-id-id" spellcheck="false" autocapitalize="off" autocomplete="off" pattern="\\w+" minlength="32" maxlength="32" aria-required="true" required />
					</div>
					<div class="form-group mb-3">
						<label for="account-id-key" class="col-form-label">API Key:</label>
						<input type="password" class="form-control" id="account-id-key" spellcheck="false" autocapitalize="off" autocomplete="off" pattern="[\\w-]+" minlength="40" maxlength="40" aria-required="true" required />
					</div>
					<div class="d-grid gap-2 d-md-flex justify-content-end">
						<input class="btn btn-outline-danger" type="reset">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
						<input class="btn btn-primary" type="submit" value="Save">
					</div>
				</form>
			</div>`).appendTo('div#settingsModal div#settings-nav-tabContent');
			newForm.find("form").submit((event) => {
				formSaved(event);
			});

			$('div#settingsModal div#account-id').tab('show');
		}
		// 1MJ8Z4yf0UZ7rwN4nj4keTXZyTBfFUq36bzkddWC
	});
	$("div#settingsModal form").submit((event) => {
		formSaved(event);
	});
	// Check for local crypto availability
	encryptedStorageAvailable((available, curve) => {
		if (available) {
			$("div#settingsModal span#localCryptoAvailable").addClass("bg-success");
			$("div#settingsModal span#localCryptoAvailable").prop("title", `Local Encryption using ECDSA with ${curve} curve`);
			$("div#settingsModal span#localCryptoAvailable i.fas").addClass("fa-check");
		} else {
			$("div#settingsModal span#localCryptoAvailable").addClass("bg-danger");
			$("div#settingsModal span#localCryptoAvailable").prop("title", `Local Encryption not available`);
			$("div#settingsModal span#localCryptoAvailable i.fas").addClass("fa-exclamation");
		}
		tooltipTriggerList.map(function (tooltipTriggerEl) {
			return new bootstrap.Tooltip(tooltipTriggerEl);
		});
	});
	// Check for local storage availability
	if (storageAvailable('localStorage')) {
		$("div#settingsModal span#localStorageAvailable").addClass("bg-success");
		$("div#settingsModal span#localStorageAvailable").prop("title", `Local Storage available`);
		$("div#settingsModal span#localStorageAvailable i.fas").addClass("fa-check");
	}
	else {
		$("div#settingsModal span#localStorageAvailable").addClass("bg-danger");
		$("div#settingsModal span#localStorageAvailable").prop("title", `Local Storage not available`);
		$("div#settingsModal span#localStorageAvailable i.fas").addClass("fa-exclamation");
	}
	tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
});

function formSaved(event) {
	console.log(event);
}

function storageAvailable(type) {
	var storage;
	try {
		storage = window[type];
		var x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
}

function encryptedStorageAvailable(callback) {
	window.crypto.subtle.generateKey({
		name: "ECDSA",
		namedCurve: "P-521", //can be "P-256", "P-384", or "P-521"
	},
		false, //whether the key is extractable (i.e. can be used in exportKey)
		["sign", "verify"] //can be any combination of "sign" and "verify"
	).then((key) => {
		//returns a keypair object
		callback(true, key.privateKey.algorithm.namedCurve);
	}).catch((err1) => {
		window.crypto.subtle.generateKey({
			name: "ECDSA",
			namedCurve: "P-384", //can be "P-256", "P-384", or "P-521"
		},
			false, //whether the key is extractable (i.e. can be used in exportKey)
			["sign", "verify"] //can be any combination of "sign" and "verify"
		).then((key) => {
			//returns a keypair object
			callback(true, key.privateKey.algorithm.namedCurve);
		}).catch((err2) => {
			window.crypto.subtle.generateKey({
				name: "ECDSA",
				namedCurve: "P-256", //can be "P-256", "P-384", or "P-521"
			},
				false, //whether the key is extractable (i.e. can be used in exportKey)
				["sign", "verify"] //can be any combination of "sign" and "verify"
			).then((key) => {
				//returns a keypair object
				callback(true, key.privateKey.algorithm.namedCurve);
			}).catch((err3) => {
				callback(false);
			});
		});
	});
}