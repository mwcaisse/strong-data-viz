import {parse} from "papaparse";
import parseDuration from "parse-duration"
import type {StrongExportRow} from "@/models/StrongExportRow";
import type {Workout, WorkoutExercise, WorkoutExerciseSet} from "@/models/Workout";
import {DateTime, Duration} from "luxon";

function parseFile(file: File) : Promise<any> {
    return new Promise((resolve, reject) => {
        parse(file, {
            complete: results => {
                resolve(results);
            },
            error: () => {
                reject(new Error("Failed to parse file import!"));
            }
        })
    });
}
async function readIntoRows(file: File) : Promise<StrongExportRow[]> {
    const parsedResults = await parseFile(file);
    const parsedData = parsedResults.data;

    let results = [];

    // skip the first row as it is the headers
    for (let i = 1; i < parsedData.length; i++) {
        const row = parsedData[i];

        // skip any rows that don't have a date or name
        if (row[0].length < 1 || row[1].length < 1) {
            continue;
        }
        results.push({
            date: row[0],
            workoutName: row[1],
            exerciseName: row[2],
            setOrder: parseInt(row[3], 10),
            weight: parseFloat(row[4]),
            weightUnit: row[5],
            reps: parseInt(row[6], 10),
            rpe: parseInt(row[7], 10),
            distance: parseInt(row[8], 10),
            distanceUnit: row[9],
            seconds: parseInt(row[10], 10),
            exerciseNotes: row[11],
            workoutNotes: row[12],
            workoutDuration: row[13]
        } as StrongExportRow);
    }

    return results;
}

function strongRowsToDictionary(strongRows: StrongExportRow[], keyFun: (r : StrongExportRow) => string): {[key: string] : StrongExportRow[] } {
    let map = {} as {[key: string] : StrongExportRow[] };

    strongRows.forEach(row => {
        const key = keyFun(row);

        if (!Object.prototype.hasOwnProperty.call(map, key)) {
            map[key] = [];
        }
        map[key].push(row);
    });

    return map;
}

function convertRowsIntoSets(strongRows: StrongExportRow[]) : WorkoutExerciseSet[] {
    return strongRows.map(row => ({
        weight: row.weight,
        weightUnit: row.weightUnit,
        reps: row.reps
    }));
}

function convertRowsIntoExercises(strongRows: StrongExportRow[], exerciseIds: Map<string, number>) : WorkoutExercise[] {
    // group all rows by [ exerciseName ], i.e. group by exercise, they are already all for one workout
    let exerciseMap = strongRowsToDictionary(strongRows, row => row.exerciseName);

    const exercises = [] as WorkoutExercise[];
    for (const key in exerciseMap) {
        if (!Object.prototype.hasOwnProperty.call(exerciseMap, key)) {
            continue;
        }
        const firstRow = exerciseMap[key][0];
        exercises.push({
            id: exerciseIds.get(firstRow.exerciseName)!,
            name: firstRow.exerciseName,
            note: firstRow.exerciseNotes,
            sets: convertRowsIntoSets(exerciseMap[key])
        });
    }

    return exercises;
}

function createExerciseIdMap(strongRows: StrongExportRow[]) : Map<string, number> {
    let exerciseId = 0;
    let results = new Map<string, number>();

    for (const row of strongRows) {
        if (results.has(row.exerciseName)) {
            continue;
        }
        results.set(row.exerciseName, exerciseId++);
    }

    return results;
}

function convertRowsIntoWorkouts(strongRows: StrongExportRow[]) : Workout[] {
    // group all rows by [date, workoutName], essentially groups by workout
    let workoutMap = strongRowsToDictionary(strongRows, row => [
        row.date,
        row.workoutName
    ].toString());

    // now for each workout, lets createeee
    const workouts = [] as Workout[];

    const exerciseIds = createExerciseIdMap(strongRows);

    let workspaceId = 0;
    for (const workoutKey in workoutMap) {
        if (!Object.prototype.hasOwnProperty.call(workoutMap, workoutKey)) {
            continue;
        }
        const firstRow = workoutMap[workoutKey][0];

        workouts.push({
            id: workspaceId++,
            // 2023-11-07 12:11:00
            date: DateTime.fromFormat(firstRow.date, "yyyy-MM-dd HH:mm:ss"),
            name: firstRow.workoutName,
            notes: firstRow.workoutNotes,
            duration: Duration.fromMillis(<number>parseDuration(firstRow.workoutDuration)).rescale(),
            exercises: convertRowsIntoExercises(workoutMap[workoutKey], exerciseIds)
        });

    }

    return workouts;
}

export async function readWorkoutFile(file: File) : Promise<Workout[]> {
    const rows = await readIntoRows(file);
    return convertRowsIntoWorkouts(rows);
}

