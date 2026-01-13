export interface Step {
    id: string;
    text: string;
    imagePlaceholder?: string;
}

export interface Technique {
    id: string;
    title: string;
    videoId?: string;
    steps: Step[];
    misconceptions: string[];
    imagePlaceholder?: string;
}

export interface Chapter {
    id: string;
    title: string;
    techniques: Technique[];
}

export interface BeltData {
    id: string;
    title: string;
    concept: string;
    description: string;
    chapters: Chapter[];
}
