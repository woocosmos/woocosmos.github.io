

function getTags (allTags) {
    const tagsArray = Object.entries(allTags);
    tagsArray.sort((a, b) => b[1].length - a[1].length);
    return allTags = tagsArray.slice(0, 3);
    }
