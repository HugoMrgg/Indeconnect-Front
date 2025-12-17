import React from "react";
export const EthicsAdminHeroBanner: React.FC = () => {
    return (
        <section className="bg-[#C9B38C] px-6 py-16 relative">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-start gap-6">
                    <div>
                        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">
                            Questionnaire Éthique
                        </h1>
                        <div className="w-24 h-1 bg-gray-900 mb-6" aria-hidden="true"></div>
                        <p className="text-gray-700 text-lg">
                            Construis le catalogue (catégories, questions, options) et pilote le cycle de validation.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
