
<template>
    <div class="section">
        <p>Hello. Welcome to the page!</p>

        <div class="file is-normal is-boxed">
            <label class="file-label">
                <input
                    class="file-input"
                    type="file"
                    style="cursor: pointer;"
                    accept=".csv"
                    @change="fileUploaded"
                >
                <span class="file-cta">
                    <span class="file-label">
                        Strong Data Export
                    </span>
                </span>
            </label>
        </div>
    </div>
</template>

<script setup lang="ts">

    import { parse } from "papaparse";

    function fileUploaded(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files.length > 0) {
            alert("We have files!");

            const file = input.files[0];

            parse(file, {
                complete: (results, file) => {
                    alert("parse successful!");
                    console.dir(results);
                },
                error: () => {
                    alert("parse failed :(");
                }
            })
        }
        else {
            alert("No files :(");
        }

    }

</script>

