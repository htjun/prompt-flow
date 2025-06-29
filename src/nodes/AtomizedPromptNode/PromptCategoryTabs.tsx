import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { useCallback } from 'react'
import { z } from 'zod'
import { imageAtomizationSchema } from '@/schema/imageAtomizationSchema'
import { ParameterInput } from './ParameterInput'

type ImageAtomization = z.infer<typeof imageAtomizationSchema>

export const PromptCategoryTabs = ({
  data,
  onDataChange,
}: {
  data?: ImageAtomization
  onDataChange: (newData: ImageAtomization) => void
}) => {
  const handleSceneChange = useCallback(
    (field: keyof NonNullable<ImageAtomization['scene']>, value: string) => {
      if (!data || !data.scene) return
      const newData = {
        ...data,
        scene: {
          ...data.scene,
          [field]: value,
        },
      }
      onDataChange(newData)
    },
    [data, onDataChange]
  )

  const handleStyleChange = useCallback(
    (field: keyof NonNullable<ImageAtomization['style']>, value: string) => {
      if (!data || !data.style) return
      const newData = {
        ...data,
        style: {
          ...data.style,
          [field]: value,
        },
      }
      onDataChange(newData)
    },
    [data, onDataChange]
  )

  const handleCameraChange = useCallback(
    (field: keyof NonNullable<ImageAtomization['camera']>, value: string) => {
      if (!data || !data.camera) return
      const newData = {
        ...data,
        camera: {
          ...data.camera,
          [field]: value,
        },
      }
      onDataChange(newData)
    },
    [data, onDataChange]
  )

  const handleSubjectChange = useCallback(
    (
      field: keyof NonNullable<ImageAtomization['subjects']>[number],
      index: number,
      value: string
    ) => {
      if (!data || !data.subjects || !data.subjects[index]) return

      const updatedSubjects = [...data.subjects]
      updatedSubjects[index] = {
        ...updatedSubjects[index],
        [field]: value,
      }

      const newData = {
        ...data,
        subjects: updatedSubjects,
      }
      onDataChange(newData)
    },
    [data, onDataChange]
  )

  if (!data) return null

  return (
    <Tabs defaultValue="scene" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="scene">Scene</TabsTrigger>
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="camera">Camera</TabsTrigger>
      </TabsList>
      <TabsContent value="scene" className="grid grid-cols-[auto_1fr] gap-2 p-2">
        {data.scene && (
          <>
            <ParameterInput
              label="Setting"
              value={data.scene.setting}
              onChange={(value) => handleSceneChange('setting', value)}
            />
            {data.scene.time !== undefined && (
              <ParameterInput
                label="Time"
                value={data.scene.time}
                onChange={(value) => handleSceneChange('time', value)}
              />
            )}
            {data.scene.weather !== undefined && (
              <ParameterInput
                label="Weather"
                value={data.scene.weather}
                onChange={(value) => handleSceneChange('weather', value)}
              />
            )}
            {data.scene.background !== undefined && (
              <ParameterInput
                label="Background"
                value={data.scene.background}
                onChange={(value) => handleSceneChange('background', value)}
              />
            )}
            {data.scene.context !== undefined && (
              <ParameterInput
                label="Context"
                value={data.scene.context}
                onChange={(value) => handleSceneChange('context', value)}
              />
            )}
          </>
        )}
      </TabsContent>
      <TabsContent value="subjects">
        {data.subjects && data.subjects.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={['subject-0']}
            className="flex w-full flex-col gap-2"
          >
            {data.subjects.map((subject, idx) => (
              <AccordionItem
                key={idx}
                value={`subject-${idx}`}
                className="flex flex-col gap-2 overflow-hidden rounded-lg border border-gray-100"
              >
                <AccordionTrigger className="px-2 py-3 text-xs font-medium hover:cursor-pointer hover:bg-gray-50/50 hover:no-underline">
                  <div className="flex items-center gap-2">
                    Subject{' '}
                    <span className="inline-flex size-5 items-center justify-center rounded-sm bg-gray-100 px-3 text-xs font-medium text-gray-500">
                      {idx + 1}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-2">
                  <div className="grid grid-cols-[auto_1fr] gap-2">
                    <ParameterInput
                      label="Type"
                      value={subject.type}
                      onChange={(value) => handleSubjectChange('type', idx, value)}
                    />
                    <ParameterInput
                      label="Description"
                      value={subject.description}
                      onChange={(value) => handleSubjectChange('description', idx, value)}
                    />
                    {subject.pose !== undefined && (
                      <ParameterInput
                        label="Pose"
                        value={subject.pose}
                        onChange={(value) => handleSubjectChange('pose', idx, value)}
                      />
                    )}
                    {subject.emotion !== undefined && (
                      <ParameterInput
                        label="Emotion"
                        value={subject.emotion}
                        onChange={(value) => handleSubjectChange('emotion', idx, value)}
                      />
                    )}
                    <ParameterInput
                      label="Position"
                      value={subject.position}
                      onChange={(value) => handleSubjectChange('position', idx, value)}
                    />
                    <ParameterInput
                      label="Size"
                      value={subject.size}
                      onChange={(value) => handleSubjectChange('size', idx, value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex items-center justify-center py-4 text-sm text-gray-400">
            No subjects defined
          </div>
        )}
      </TabsContent>
      <TabsContent value="style" className="grid grid-cols-[auto_1fr] gap-2 p-2">
        {data.style && (
          <>
            <ParameterInput
              label="Art Style"
              value={data.style.art_style}
              onChange={(value) => handleStyleChange('art_style', value)}
            />
            <ParameterInput
              label="Color Palette"
              value={data.style.color_palette}
              onChange={(value) => handleStyleChange('color_palette', value)}
            />
            <ParameterInput
              label="Mood"
              value={data.style.mood}
              onChange={(value) => handleStyleChange('mood', value)}
            />
            <ParameterInput
              label="Lighting"
              value={data.style.lighting}
              onChange={(value) => handleStyleChange('lighting', value)}
            />
          </>
        )}
      </TabsContent>
      <TabsContent value="camera" className="grid grid-cols-[auto_1fr] gap-2 p-2">
        {data.camera && (
          <>
            <ParameterInput
              label="Angle"
              value={data.camera.angle}
              onChange={(value) => handleCameraChange('angle', value)}
            />
            <ParameterInput
              label="Focal Length"
              value={data.camera.focal_length}
              onChange={(value) => handleCameraChange('focal_length', value)}
            />
            <ParameterInput
              label="Aperture"
              value={data.camera.aperture}
              onChange={(value) => handleCameraChange('aperture', value)}
            />
            <ParameterInput
              label="Depth of Field"
              value={data.camera.depth_of_field}
              onChange={(value) => handleCameraChange('depth_of_field', value)}
            />
          </>
        )}
      </TabsContent>
    </Tabs>
  )
}
