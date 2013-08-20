// Copyright (c) 2013 Yichao Yu. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// The onClicked callback function.
function onClickHandler(info) {
	console.log(JSON.stringify(info));

};

chrome.contextMenus.onClicked.addListener(onClickHandler);

chrome.runtime.onInstalled.addListener(function (object) {
	if( !('HTMLMenuItemElement' in window) || !('HTMLCommandElement' in window)){
		console.log(object.reason);
	}
	// Create one test item for each context type.
	var contexts = ["page","selection","link","editable","image","video","audio"];
	
	for (var i = 0; i< contexts.length; i++) {
		var context =  contexts[i];
		var id = chrome.contextMenus.create({"title": "Add to Note", "contexts":[context], "id": "context_" + context});
		chrome.contextMenus.create({"title": "Add to Recent notes...", "contexts":[context], "parentId": "context_" + context, "id": context + "_recent_notes"});
		chrome.contextMenus.create({"title": "Open a new Note", "contexts":[context], "parentId": "context_" + context, "id": context + "_new_note"});
		// mock up the exsting recet notes.
		chrome.contextMenus.create({"title": "Note_1", "contexts":[context], "parentId": context + "_recent_notes", "id": context + "_recent_note_1"});
		chrome.contextMenus.create({"title": "Note_2", "contexts":[context], "parentId": context + "_recent_notes", "id": context + "_recent_note_2"});
		chrome.contextMenus.create({"title": "Note_3", "contexts":[context], "parentId": context + "_recent_notes", "id": context + "_recent_note_3"});
		// separator between recet notes and open existing note
		chrome.contextMenus.create({"type": "separator", "contexts":[context], "parentId": context + "_recent_notes", "id": context + "recent_existing_separator"});
		chrome.contextMenus.create({"title": "Open an Existing Note...", "contexts":[context], "parentId": context + "_recent_notes", "id": context + "_open_existing_note"});
		// mock tagging feature.
		chrome.contextMenus.create({"title": "(No Tag)", "type": "checkbox", "contexts":[context], "parentId": context + "_recent_note_2", "id": context + "_no_tag"});
		chrome.contextMenus.create({"title": "Life Style", "type": "checkbox", "contexts":[context], "parentId": context + "_recent_note_2", "id": context + "_tag_life_style"});
		chrome.contextMenus.create({"title": "Food", "type": "checkbox", "contexts":[context], "parentId": context + "_recent_note_2", "id": context + "_tag_food"});
	}
	
});

function driverApiLoaded() {
	var fileListRequest = gapi.client.drive.files.list();
	fileListRequest.execute(function(resp) {
      console.log(resp.items);
    });
}